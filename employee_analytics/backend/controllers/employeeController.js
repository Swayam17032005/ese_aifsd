const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Basic validation is handled by mongoose schema
    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    // Handle duplicate email error specifically or send general validation error
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private
exports.searchEmployees = async (req, res) => {
  try {
    const { department, name } = req.query;
    
    let query = {};
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const employees = await Employee.find(query);
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        await employee.deleteOne();
        res.json({ success: true, message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}
