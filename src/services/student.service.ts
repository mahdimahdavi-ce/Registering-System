import { userInfo } from "os";
import { StudentModel } from "../Models/student.model";
import { termModel } from "../Models/term.model";
import { preRegistrationModel } from "../Models/‫‪preRegistration‬‬.model";
import { registrationModel } from "../Models/registration.model";
import { termCourseModel } from "../Models/termCourse.model";

export async function createStudent(students: any) {
    try {
        for (const student of students) {
            let newStudent = new StudentModel(student)
            await newStudent.save()
        }
        return "The new students have been added successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteStudent(id: string) {
    let deleteResult = await StudentModel.deleteOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return error
        })

    if (deleteResult.deletedCount === 0) {
        return `The student with ${id} id dosen't exist`
    }
    return `The student with ${id} id is deleted successfully`
}

export async function getAllStudents(search: any) {
    let students = await StudentModel.find({}, "-password")
        .catch((error) => {
            console.log(error)
            return error
        })

    if (search !== undefined) {
        return students.filter((student: any) => {
            if (student.firstName.includes(search) || student.lastName.includes(search)) {
                return student
            }
        })
    } else {
        return students
    }
}

export async function getStudentById(id: string) {
    let getResult = await StudentModel.findById(id, "-password")
        .catch((error) => {
            console.log(error)
            return error
        })
    if (getResult.stringValue != undefined) {
        return `The student with given id dosen't exist`
    }

    return getResult
}

export async function updateStudentById(id: string, updatedValues: any) {
    let updatedResult = await StudentModel.updateOne({ _id: id }, updatedValues)
        .catch((error) => {
            console.log(error)
            return error
        })

    if (updatedResult.modifiedCount === 0) {
        return `The student with ${id} id dosen't exist`
    }

    return updatedResult

}

// services for the HW3

export async function addPreRegistrationRequest(studentInfo: any, termId: any, courses: any) {
    try {
        const term: any = await termModel.findOne({ _id: termId })
            .catch((error) => {
                console.log(error)
                return `The term with ${studentInfo._id} id dosen't exist`
            })

        const preRegistrationRecord = new preRegistrationModel({
            termId: termId,
            studentId: studentInfo._id,
            requestedCourses: courses
        })
        await preRegistrationRecord.save()

        for (let course of courses) {
            if (term.courses.has(course)) {
                term.courses.set(course, parseInt(term.courses.get(course)) + 1)
            } else {
                term.courses.set(course, 0)
            }
        }

        const updateResult = await termModel.updateOne({ _id: termId }, term)
        return "Your request has been added to preRegistration list successfully"

    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deletePreRegisterRequest(studentInfo: any, termId: any) {
    try {
        const term: any = await termModel.findOne({ _id: termId })
            .catch((error) => {
                console.log(error)
                return `The term with ${studentInfo._id} id dosen't exist`
            })

        let preRegistrationRecord: any = await preRegistrationModel.findOne({
            termId: termId,
            studentId: studentInfo._id
        })
        console.log(preRegistrationRecord)
        const requestedCourses = preRegistrationRecord.requestedCourses
        console.log(requestedCourses)
        await preRegistrationModel.deleteOne({
            termId: termId,
            studentId: studentInfo._id
        })

        for (let course of requestedCourses) {
            if (term.courses.has(course)) {
                term.courses.set(course, parseInt(term.courses.get(course)) - 1)
            }
        }
        const u = await termModel.updateOne({ _id: termId }, term)
        console.log(u)

        return "The preRegistration request has been deleted successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function addRegistrationRequest(studentInfo: any, termId: any, courseName: any) {
    let registerationRecord = await registrationModel.findOne({
        termId: termId,
        studentId: studentInfo._id
    })

    // In case of not founding any registration for the user, the system create a new document for this user
    if (registerationRecord === null) {
        registerationRecord = new registrationModel({
            termId: termId,
            studentId: studentInfo._id,
            courses: [],
            acceptByEducationalManager: false,
            acceptByProfessor: false,
            isSubmited: false
        })
        registerationRecord.save()
    }

    // The course that user wants to register on
    let registredCourse: any = await termCourseModel.findOne({
        termId: termId,
        courseName: courseName
    })

    // If the courses have overlap, the registration will be canceled
    for (let course of registerationRecord.courses) {
        let termCourse: any = await termCourseModel.findOne({
            courseName: course,
            termId: termId
        })

        if ((registredCourse.courseTime[0] >= termCourse.courseTime[0] && registredCourse.courseTime[0] <= termCourse.courseTime[1]) ||
            (termCourse.courseTime[0] >= registredCourse.courseTime[0] && termCourse.courseTime[0] <= registredCourse.courseTime[1])) {
            return `The registration is failed, because the time of this course has overlap with the time of ${course} course`
        }
    }

    // If the student hasn't still pass the preRequirment courses of this course, the registraiton will be canceled
    const previousRegistrations: any = await registrationModel.find({
        studentId: studentInfo._id
    })

    let coursesThatArePassed: any = []

    for (const registration of previousRegistrations) {
        coursesThatArePassed = coursesThatArePassed.concat(registration.courses)
    }

    for(let preReqCourse of registredCourse.preRequisites){
        if(!coursesThatArePassed.includes(preReqCourse)){
            return `The registration is failed, because first you need to pass ${preReqCourse} coures (it's mandatory to pass ${preReqCourse} first)`
        }
    }

    // adding course to the registration record of this student
    await registrationModel.updateOne({
        termId: termId,
        studentId: studentInfo._id
    }, {
        $push: {
            courses: courseName
        }
    })

    // decrementing the capcity of course by 1
    registredCourse.capacity = registredCourse.capacity - 1
    // registaring the student in the course
    registredCourse.registeredStudents.push(studentInfo._id)
    // saving the changes in the database
    await termCourseModel.updateOne({
        termId: termId,
        courseName: courseName
    }, registredCourse)

    return `The ${courseName} is registered for you successfully`
}

export async function deleteRegistrationRequest(studentInfo: any, termId: any, course: any) {
    let registerationRecord: any = await registrationModel.findOne({
        termId: termId,
        studentId: studentInfo._id
    })

    let updatedCourses = registerationRecord.courses.filter((currentCourse: any) => {
        if (currentCourse !== course) {
            return currentCourse
        }
    })

    await registrationModel.updateOne({
        termId: termId,
        studentId: studentInfo._id
    }, {
        termId: termId,
        studentId: studentInfo._id,
        courses: updatedCourses,
        acceptByEducationalManager: false,
        acceptByProfessor: false,
        isSubmited: false
    })

    let registredCourse: any = await termCourseModel.findOne({
        termId: termId,
        courseName: course
    })

    registredCourse.capacity = registredCourse.capacity + 1
    registredCourse.registeredStudents = registredCourse.registeredStudents.filter((currentStudentId: any) => {
        if (currentStudentId !== studentInfo._id) {
            return currentStudentId
        }
    })

    await termCourseModel.updateOne({
        termId: termId,
        courseName: course
    }, registredCourse)

    return `The ${course} is deleted for you successfully`
}


export async function getAllRegistratinos(studentInfo: any, termId: any) {
    let registerationRecord: any = await registrationModel.findOne({
        termId: termId,
        studentId: studentInfo._id
    })

    if (registerationRecord === null) {
        return `There is not registration record for you!`
    } else {
        return registerationRecord.courses
    }
}