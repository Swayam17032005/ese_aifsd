const axios = require('axios');
const Employee = require('../models/Employee');

// @desc    Get AI recommendations
// @route   POST /api/ai/recommend
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    // We can accept an employeeId in the body to evaluate a single employee, 
    // or evaluate all employees. Let's support evaluating specific employees.
    const { employeeIds } = req.body;
    
    let employees = [];
    if (employeeIds && employeeIds.length > 0) {
        employees = await Employee.find({ _id: { $in: employeeIds } });
    } else {
        // Evaluate top recent or all (limit for API reasons)
        employees = await Employee.find().limit(10);
    }

    if (!employees || employees.length === 0) {
        return res.status(404).json({ success: false, message: 'No employees found to analyze' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ success: false, message: 'AI recommendations are not configured' });
    }

    // Format data for prompt
    const employeeDataStr = employees.map(emp => {
        return `Name: ${emp.name}, Dept: ${emp.department}, Skills: ${emp.skills.join(', ')}, Score: ${emp.performanceScore}/100, Exp: ${emp.experience} yrs`;
    }).join('\n');

    const prompt = `You are an expert HR AI Assistant. Analyze the following employee data and provide insights.
Data:
${employeeDataStr}

Tasks:
1. Identify high-performance employees suitable for promotion.
2. Provide constructive improvement feedback for employees with low scores (under 60).
3. Suggest training for employees who might have missing or outdated skills based on their department.
4. Provide a ranked list of these employees based on value and performance.

Format the output as a JSON object with the following structure:
{
  "promotions": [{"name": "...", "reason": "..."}],
  "improvementFeedback": [{"name": "...", "feedback": "..."}],
  "trainingSuggestions": [{"name": "...", "suggestions": "..."}],
  "ranking": [{"name": "...", "score": ...}]
}
Return ONLY valid JSON. No markdown formatting like \`\`\`json.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemma-4-31b-it:free', // Using a reliable free model
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let aiOutput = response.data.choices[0].message.content || '';
    aiOutput = aiOutput.trim();
    
    // Extract JSON from output in case the model added conversational text or think tags
    let jsonString = aiOutput;
    const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    
    // Clean up potential markdown formatting if model didn't obey
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    let jsonOutput = null;
    try {
      jsonOutput = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error. Raw string:', jsonString);
      return res.status(500).json({ success: false, message: 'AI returned invalid JSON' });
    }

    res.json({ success: true, data: jsonOutput });
  } catch (error) {
    console.error('AI Error:', error.response ? error.response.data : error.message);

    return res.status(502).json({
      success: false,
      message: error.response ? 'AI provider request failed' : 'Unable to generate AI recommendations'
    });
  }
};
