import mongoose from 'mongoose'
import { Client_Type } from '../../models/types'
import { clientsSchema } from './dataModel'

export default mongoose.model<Client_Type>('Client', clientsSchema)
