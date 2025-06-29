const Skill = require('../models/Skill')

exports.createSkill = async (req, res) => {
  const { name, level } = req.body

  try {
    const newSkill = new Skill({
      name,
      level,
      user: req.userId,
    })

    const savedSkill = await newSkill.save()
    res.status(201).json(savedSkill)
  } catch (error) {
    console.error('Error al guardar la habilidad:', error.message)
    res.status(500).json({ message: 'Error del servidor ' })
  }
}

exports.updateSkill = async (req, res) => {
  const skillId = req.params.id
  const { name, level } = req.body

  try {
    const skill = await Skill.findById(skillId)

    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' })
    }

    if (skill.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    skill.name = name || skill.name
    skill.level = level || skill.level

    const updated = await skill.save()
    res.json(updated)
  } catch (error) {
    console.error('Error al actualizar habilidad:', error.message)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

exports.obtainSkill = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.userId })
    res.json(skills)
  } catch (error) {
    console.error('Error al obtener habilidades: ', error.message)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

exports.deleteSkill = async (req, res) => {
  const skillId = req.params.id

  try {
    const skill = await Skill.findById(skillId)

    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' })
    }

    if (skill.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    await Skill.findByIdAndDelete(skillId)
    res.json({ message: 'Habilidad eliminada' })
  } catch (error) {
    console.error('Error al eliminar habilidad:', error.message)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
