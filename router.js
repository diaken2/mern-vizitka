import Entry from "./models/Entry.js";
import express from 'express'
import User from './models/User.js'
import bcrypt from 'bcrypt'
const router = express.Router()

router.post('/entries', async (req, res) => {
        console.log('Получено')
  try {
    const entry = new Entry(req.body)
    await entry.save()
    res.status(201).json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})


router.get('/created-users', async (req, res) => {
try {
const users = await User.find({}, '-passwordHash') // исключаем хеш пароля
res.json(users)
} catch (err) {
res.status(500).json({ error: 'Ошибка загрузки' })
}
}) 


router.delete('/created-users/:id', async (req, res) => {
try {
await User.findByIdAndDelete(req.params.id)
res.json({ message: 'Пользователь удалён' })
} catch (err) {
res.status(500).json({ error: 'Ошибка удаления' })
}
})

router.get('/entries', async (req, res) => {
    console.log('Выведено')
  try {
    const entries = await Entry.find().sort({ createdAt: -1 }).limit(1500)
    res.status(200).json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


router.post('/auth/login', async (req, res) => {
const { username, password } = req.body;
console.log(username,password)

try {
const user = await User.findOne({ username });


if (!user || !(await user.verifyPassword(password))) {
  return res.status(401).json({ error: 'Неверный логин или пароль' });
}

res.json({
  userId: user._id,
  username: user.username,
  role: user.role,
});
} catch (err) {
res.status(500).json({ error: 'Ошибка сервера' });
}
});



router.get('/me/:id', async (req, res) => {
const user = await User.findById(req.params.id)
if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
res.json({ username: user.username, role: user.role })
})



router.post('/create-users', async (req, res) => {
  console.log('Процесс создания пользователя...')
const { username, password, role } = req.body

const passwordHash = await bcrypt.hash(password, 10)
const user = new User({ username, passwordHash, role })

try {
await user.save()
res.status(201).json({ message: 'Пользователь создан' })
} catch (err) {
res.status(400).json({ error: err.message })
}
})


router.delete('/entries/old', async (req, res) => {
  try {
    const count = await Entry.countDocuments()
    if (count > 1500) {
      const excess = count - 1500
      const toDelete = await Entry.find().sort({ createdAt: 1 }).limit(excess)
      const ids = toDelete.map(e => e._id)
      await Entry.deleteMany({ _id: { $in: ids } })
      res.status(200).json({ message: `Удалено ${excess} старых записей` })
    } else {
      res.status(200).json({ message: 'Удаление не требуется' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/entries/:id', async (req, res) => {
try {
const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true })
res.json(entry)
} catch (err) {
res.status(400).json({ error: err.message })
}
})


router.delete('/entries/:id', async (req, res) => {
try {
await Entry.findByIdAndDelete(req.params.id)
res.json({ message: 'Запись удалена' })
} catch (err) {
res.status(500).json({ error: err.message })
}
})

export default router