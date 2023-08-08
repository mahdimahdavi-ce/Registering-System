import { termCourseModel } from "../Models/termCourse.model"

export async function createTermCourse(courseInfo: any) {
    try {
        let newCourse = new termCourseModel(courseInfo)
        await newCourse.save()
        return "The new termCourse has been added successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteTermCourse(id: string) {
    let deleteResult = await termCourseModel.deleteOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return error
        })

    if (deleteResult.deletedCount === 0) {
        return `The termCourse with ${id} id dosen't exist`
    }
    return `The termCourse with ${id} id is deleted successfully`
}

export async function getAllTermCourses() {
    return await termCourseModel.find({})
        .catch((error) => {
            console.log(error)
            return "Internal server error"
        })
}

export async function getTermCourseById(id: string) {
    return await termCourseModel.findById(id)
        .catch((error) => {
            console.log(error)
            return `The termCourse with ${id} id dosen't exist`
        })
}

export async function UpdateTermCourseById(id: string, updatedValues: any) {
    return await termCourseModel.updateOne({ _id: id }, updatedValues)
        .catch((error) => {
            console.log(error)
            return `The termCourse with ${id} id dosen't exist`
        })
}