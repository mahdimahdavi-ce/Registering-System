import { termModel } from '../Models/term.model'
import { termCourseModel } from '../Models/termCourse.model'

export async function createTerm(termInfo: any) {
    try {
        let newTerm = new termModel(termInfo)
        await newTerm.save()
        return "The new term has been added successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteTerm(id: string) {
    let deleteResult = await termModel.deleteOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return error
        })

    if (deleteResult.deletedCount === 0) {
        return `The term with ${id} id dosen't exist`
    }
    return `The term with ${id} id is deleted successfully`
}

export async function getAllTerms() {
    return await termModel.find({})
        .catch((error) => {
            console.log(error)
            return "Internal server error"
        })
}

export async function getTermById(id: string) {
    return await termModel.findById(id)
        .catch((error) => {
            console.log(error)
            return `The term with ${id} id dosen't exist`
        })
}

export async function updateTermById(id: string, updatedValues: any) {
    return await termModel.updateOne({ _id: id }, updatedValues)
        .catch((error) => {
            console.log(error)
            return `The term with ${id} id dosen't exist`
        })
}

export async function addNewCourseToPreReg(id: string, courses: [string]) {

    const term: any = await termModel.findOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return `The term with ${id} id dosen't exist`
        })

    for (let course of courses) {
        if (term.courses.has(course)) {
            continue
        } else {
            term.courses.set(course, 0)
        }
    }

    const updateResult = await termModel.updateOne({ _id: id }, term)
    if (updateResult.modifiedCount > 0) {
        return "Courses are added successfully to preRegistration list"
    }

}

export async function returnAllPreRegCourses(id: string, search: any) {
    const term: any = await termModel.findOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return `The term with ${id} id dosen't exist`
        })

    if (search !== undefined) {
        return [...term.courses.keys()].filter((course) => {
            if (course.includes(search)) {
                return course
            }
        })
    } else {
        return [...term.courses.keys()]
    }

}

export async function deleteCourseFromPreReg(termId: string, course: string) {
    const term: any = await termModel.findOne({ _id: termId })
        .catch((error) => {
            console.log(error)
            return `The term with ${termId} id dosen't exist`
        })

    if (term.courses.has(course)) {
        term.courses.delete(course)
    } else {
        return `${course} is not in preRegistration list`
    }

    const updateResult = await termModel.updateOne({ _id: termId }, term)
    if (updateResult.modifiedCount > 0) {
        return "Course is removed successfully from preRegistration list"
    }
}

export async function preRegistrationReport(id: string) {
    const term: any = await termModel.findOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return `The term with ${id} id dosen't exist`
        })
    return term.courses
}

export async function preRegistrationOfACourse(termId: string, search: any) {
    const term: any = await termModel.findOne({ _id: termId })
        .catch((error) => {
            console.log(error)
            return `The term with ${termId} id dosen't exist`
        })

    let result: any = {}
    for (let course of term.courses.keys()) {
        if (course.includes(search)) {
            result[course] = term.courses.get(course)
        }
    }

    return result

    // if (term.courses.has(course)) {
    //     return `${term.courses.get(course)} of students want to enroll on this course`
    // } else {
    //     return `${course} is not in preRegistration list`
    // }
}

export async function addNewCourseToReg(termId: string, courses: any) {
    try {
        const term: any = await termModel.findOne({ _id: termId })
            .catch((error) => {
                console.log(error)
                return `The term with ${termId} id dosen't exist`
            })

        const obj = { term: term.name }

        for (let course of courses) {
            let newCourse = new termCourseModel({ ...course, ...obj })
            await newCourse.save()
        }
        return "The new Courses are added into registration list"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function returnAllRegCourses(termId: string, searchValue: any) {
    const term: any = await termModel.findOne({ _id: termId })
        .catch((error) => {
            console.log(error)
            return `The term with ${termId} id dosen't exist`
        })

    let courses = await termCourseModel.find({
        term: term.name
    })

    console.log(courses)
    console.log(searchValue)

    if (searchValue !== undefined) {
        return courses.filter((course) => {
            if (course.courseName.includes(searchValue)) {
                return course
            }
        })
    } else {
        return courses
    }


}

export async function deleteCourseFromReg(termId: string, course: string) {
    const term: any = await termModel.findOne({ _id: termId })
        .catch((error) => {
            console.log(error)
            return `The term with ${termId} id dosen't exist`
        })
    const deleteResult = await termCourseModel.deleteOne({
        courseName: course,
        term: term.name
    })
    if (deleteResult.deletedCount === 0) {
        return `The course dosen't exist on registration list`
    }
    return `The course deleted successfully`
}