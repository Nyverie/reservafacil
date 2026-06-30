import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
console.log('Iniciando seed...')

await prisma.reserva.deleteMany()
await prisma.cancha.deleteMany()
await prisma.usuario.deleteMany()

const superadmin = await prisma.usuario.create({
data: {
nombre: 'Super Admin',
email: 'superadmin@reservafacil.com',
password: await bcrypt.hash('superadmin123', 10),
rol: 'SUPERADMIN',
},
})

const admin = await prisma.usuario.create({
data: {
nombre: 'Administrador',
email: 'admin@reservafacil.com',
password: await bcrypt.hash('admin123', 10),
rol: 'ADMIN',
},
})

const usuario = await prisma.usuario.create({
data: {
nombre: 'Juan Pérez',
email: 'usuario@reservafacil.com',
password: await bcrypt.hash('usuario123', 10),
rol: 'USUARIO',
},
})

await Promise.all([
prisma.cancha.create({
data: {
nombre: 'Cancha Fútbol 1',
tipo: 'FUTBOL',
descripcion: 'Cancha de césped sintético, capacidad 10 personas',
precioPorHora: 50,
capacidad: 10,
},
}),
prisma.cancha.create({
data: {
nombre: 'Cancha Tenis A',
tipo: 'TENIS',
descripcion: 'Cancha de polvo de ladrillo',
precioPorHora: 30,
capacidad: 4,
},
}),
prisma.cancha.create({
data: {
nombre: 'Cancha Básquet',
tipo: 'BASQUET',
descripcion: 'Cancha techada con iluminación LED',
precioPorHora: 40,
capacidad: 10,
},
}),
])

console.log('Seed completado!')
console.log('Superadmin:', superadmin.email, '/ superadmin123')
console.log('Admin:', admin.email, '/ admin123')
console.log('Usuario:', usuario.email, '/ usuario123')
}

main()
.catch((error) => {
console.error(error)
})
.finally(async () => {
await prisma.$disconnect()
})

