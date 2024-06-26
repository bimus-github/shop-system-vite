/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Client_Type } from '../../models/types'
import ClientModel from '../schemas/clientModel'
import fs from 'fs'

export const checkClient = async (client: Client_Type) => {
  try {
    const checked = await ClientModel.findOne({
      name: client.name
    })
    return JSON.parse(JSON.stringify(checked))
  } catch (error) {
    console.log(error)
  }
}

export const getClients = async () => {
  try {
    const clients = await ClientModel.find()
    return JSON.parse(JSON.stringify(clients))
  } catch (error) {
    console.log(error)
  }
}

export const createClient = async (client: Client_Type) => {
  try {
    // build regExp for barcode and name lowercase
    const checked = await checkClient(client)
    if (checked) {
      return Message_Forms.ALREADY_EXISTS
    }
    await ClientModel.create(client)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const updateClient = async (client: Client_Type) => {
  try {
    await ClientModel.updateOne({ id: client.id }, client)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteClient = async (client: Client_Type) => {
  try {
    await ClientModel.deleteOne({ id: client.id })
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const addAllClients = async () => {
  try {
    const res = fs.readFileSync(
      '/Users/sardorbekaminjonov/Madaminjon/electron apps/shop-system-mdb-vite/data/data.json',
      'utf-8'
    )

    const clients = JSON.parse(res).buyers
    const newClients = clients.map(
      (c) =>
        ({
          name: c.name,
          id: c.id,
          date: c.date,
          phone: c.tel
        }) as Client_Type
    )

    await ClientModel.insertMany(newClients)
  } catch (error) {
    console.log(error)
  }
}
