//import mongoose from 'mongoose'
//import { beforeAll, afterAll } from '@jest/globals'
//import { initialDatabase } from '../db/init.js'

const mongoose = require('mongoose')
const { beforeAll, afterAll } = require('@jest/globals')
const { initialDatabase } = require('../db/init.js')

beforeAll(async () => {
  await initialDatabase()
})

afterAll(async () => {
  await mongoose.disconnect()
})
