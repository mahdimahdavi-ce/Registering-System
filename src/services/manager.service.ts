import { ManagerModel } from "../Models/manager.model";
import { registrationModel } from "../Models/registration.model";

export async function createManager(managers: any) {
    try {
        for (const manager of managers) {
            let newManager = new ManagerModel(manager)
            await newManager.save()
        }
        return "The new managers have been added successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteManager(id: string) {
    let deleteResult = await ManagerModel.deleteOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return error
        })

    if (deleteResult.deletedCount === 0) {
        return `The manager with ${id} id dosen't exist`
    }
    return `The manager with ${id} id is deleted successfully`
}

export async function getAllManagers() {
    return await ManagerModel.find({}, "-password")
        .catch((error) => {
            console.log(error)
            return error
        })
}

export async function getManagerById(id: string) {
    let getResult = await ManagerModel.findById(id, "-password")
        .catch((error) => {
            console.log(error)
            return error
        })

    if (getResult.stringValue != undefined) {
        return `The manager with ${id} id dosen't exist`
    }

    return getResult
}

export async function updateManagerById(id: string, updatedValues: any) {
    let updatedResult = await ManagerModel.updateOne({ _id: id }, updatedValues)
        .catch((error) => {
            console.log(error)
            return error
        })

    if (updatedResult.modifiedCount === 0) {
        return `The manager with ${id} id dosen't exist`
    }

    return updatedResult

}
