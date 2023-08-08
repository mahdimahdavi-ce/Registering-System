import { ProfessorModel } from "../Models/professor.model";
import { registrationModel } from "../Models/registration.model";
import { termCourseModel } from "../Models/termCourse.model";

export async function createProfessor(professors: any) {
    try {
        for (const professor of professors) {
            let newProfessor = new ProfessorModel(professor)
            await newProfessor.save()
        }
        return "The new professors have been added successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteProfessor(id: string) {
    let deleteResult = await ProfessorModel.deleteOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return error
        })

    if (deleteResult.deletedCount === 0) {
        return `The professor with ${id} id dosen't exist`
    }
    return `The professor with ${id} id is deleted successfully`
}

export async function getAllProfessors(search: any) {
    let professors = await ProfessorModel.find({}, "-password")
        .catch((error) => {
            console.log(error)
            return error
        })
    if (search !== undefined) {
        return professors.filter((professor: any) => {
            if (professor.firstName.includes(search) || professor.lastName.includes(search)) {
                return professor
            }
        })
    } else {
        return professors
    }
}

export async function getProfessorById(id: string) {
    let getResult = await ProfessorModel.findById(id, "-password")
        .catch((error) => {
            console.log(error)
            return error
        })
    if (getResult.stringValue != undefined) {
        return `The professor with ${id} id dosen't exist`
    }

    return getResult
}

export async function updateProfessorById(id: string, updatedValues: any) {
    let updateResult = await ProfessorModel.updateOne({ _id: id }, updatedValues)
        .catch((error) => {
            console.log(error)
            return error
        })
    console.log(updateResult)
    if (updateResult.modifiedCount === 0) {
        return `The professor with ${id} id dosen't exist`
    }

    return updateResult
}

// Endpoints for the HW3

export async function getAllRegistrationsForASemester(termId: any) {
    return await registrationModel.find({
        termId: termId
    })
}

export async function getAllRegistrationsForACourse(courseId: any) {
    const course: any = await termCourseModel.findOne({
        _id: courseId
    })

    return course.registeredStudents
}

export async function acceptTheRegistraionOfAStudent(studentId: any, termId: any, status: any, userInfo: any) {
    const registraionRecord: any = await registrationModel.findOne({
        termId: termId,
        studentId: studentId
    })

    if (status === "Agree") {

        if (userInfo.role === "Professor") {
            registraionRecord.acceptByProfessor = true
        } else {
            registraionRecord.acceptByEducationalManager = true
        }
        await registrationModel.updateOne({
            termId: termId,
            studentId: studentId
        }, registraionRecord)
        return "Your aggreement is submited successfully"

    } else {

        for (let courseName of registraionRecord.courses) {
            let course: any = await termCourseModel.findOne({
                termId: termId,
                courseName: courseName
            })

            course.capacity = course.capacity + 1
            course.registeredStudents = course.registeredStudents.filter((currentStudentId: any) => {
                if (currentStudentId !== studentId) {
                    return currentStudentId
                }
            })

            await termCourseModel.updateOne({
                termId: termId,
                courseName: courseName
            }, course)
        }

        // update the acceptByProfessor
        // if(userInfo.role === "Professor"){
        //     registraionRecord.acceptByProfessor = false
        // } else {
        //     registraionRecord.acceptByEducationalManager = false
        // }
        // await registrationModel.updateOne({
        //     termId: termId,
        //     studentId: studentId
        // }, registraionRecord)

        await registrationModel.deleteOne({
            termId: termId,
            studentId: studentId
        })

        return "Your disaggrement is submited successfully, due to that the registration of specified student is canceled"
    }

}