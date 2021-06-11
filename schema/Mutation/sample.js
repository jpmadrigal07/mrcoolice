createCollege: {
    type: CollegeType,
    args: {
        collegeName: { type: GraphQLNonNull(GraphQLString) },
        collegeCode: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, args) => {
        const college = Colleges(args)
        return college.save({collegeName: args.collegeName, collegeCode: args.collegeCode})
    }
},
updateCollege: {
    type: CollegeType,
    args: {
        _id: { type: GraphQLID },
        collegeName: { type: GraphQLString },
        collegeCode: { type: GraphQLString }
    },
    resolve: (parent, args) => {
        return Colleges.findByIdAndUpdate({_id: args._id}, {collegeName: args.collegeName, collegeCode: args.collegeCode})
    }
},
deleteCollege: {
    type: CollegeType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const college = Colleges(args)
        return college.delete({_id: args._id})
    }
},
createCourse: {
    type: CourseType,
    args: {
        courseName: { type: GraphQLNonNull(GraphQLString) },
        courseCode: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, args) => {
        const course = Courses(args)
        return course.save({courseName: args.courseName, courseCode: args.courseCode})
    }
},
updateCourse: {
    type: CourseType,
    args: {
        _id: { type: GraphQLID },
        courseName: { type: GraphQLString },
        courseCode: { type: GraphQLString }
    },
    resolve: (parent, args) => {
        return Courses.findByIdAndUpdate({_id: args._id}, {courseName: args.courseName, courseCode: args.courseCode})
    }
},
deleteCourse: {
    type: CourseType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const course = Courses(args)
        return course.delete({_id: args._id})
    }
},
createStudent: {
    type: StudentType,
    args: {
        userId: { type: GraphQLID },
        lrn: { type: GraphQLNonNull(GraphQLString) },
        campusId: { type: GraphQLNonNull(GraphQLString) },
        admitType: {type:GraphQLString},
        typeOfStudent: {type:GraphQLString},
        firstName: {type:GraphQLString},
        middleName: {type:GraphQLString},
        lastName: {type:GraphQLString},
        extensionName: {type:GraphQLString},
        mobileNumber: {type:GraphQLString},
        landlineNumber: {type:GraphQLString},
        dateOfBirth: {type:GraphQLString},
        placeOfBirth: {type:GraphQLString},
        gender:{ type: GraphQLNonNull(GraphQLString) },
        citizenship: { type: GraphQLNonNull(GraphQLString) },
        houseNumber: { type: GraphQLNonNull(GraphQLString) },
        street: { type: GraphQLNonNull(GraphQLString) },
        barangay: { type: GraphQLNonNull(GraphQLString) },
        municipality: { type: GraphQLNonNull(GraphQLString) },
        province: { type: GraphQLNonNull(GraphQLString) },
        zipCode: { type: GraphQLNonNull(GraphQLString) },
        civilStatus:{ type: GraphQLNonNull(GraphQLString) },
        guardianName: { type: GraphQLNonNull(GraphQLString) },
        guardianAddress: { type: GraphQLNonNull(GraphQLString) },
        fathersName: { type: GraphQLNonNull(GraphQLString) },
        mothersName: { type: GraphQLNonNull(GraphQLString) },
        dswdHouseholdNumber: {type:GraphQLString},
        dswdHouseholdPerCapitaIncome: {type: GraphQLInt},
        guardianMobileNumber: { type: GraphQLNonNull(GraphQLString) },
        guardianEmail: { type: GraphQLNonNull(GraphQLString) },
        relationWithGuardian: { type: GraphQLNonNull(GraphQLString) },
        intendedCourse:{ type: GraphQLNonNull(GraphQLString) },
        educationalAttainment:{ type: GraphQLNonNull(GraphQLString) },
        disability:{type:GraphQLString},
        isIndigenousPerson:{type: GraphQLNonNull(GraphQLBoolean)},

    },
    resolve: (parent, args) => {
        const student = Student(args)
        return student.save({
            lrn: args.lrn, 
            campusId: args.campusId,
            admitType:args.admitType,
            typeOfStudent:args.typeOfStudent,
            firstName:args.firstName,
            middleName:args.middleName,
            lastName:args.lastName,
            extensionName:args.extensionName,
            mobileNumber:args.mobileNumber,
            landlineNumber:args.landlineNumber,
            dateOfBirth:args.dateOfBirth,
            placeOfBirth:args.placeOfBirth,
            gender:args.gender,
            citizenship:args.citizenship,
            houseNumber:args.houseNumber,
            street:args.street,
            barangay:args.barangay,
            municipality:args.municipality,
            province:args.province,
            zipCode:args.zipCode,
            civilStatus:args.civilStatus,
            guardianName:args.guardianName,
            guardianAddress:args.guardianAddress,
            fathersName:args.fathersName,
            mothersName:args.mothersName,
            dswdHouseholdNumber:args.dswdHouseholdNumber,
            dswdHouseholdPerCapitaIncome:args.dswdHouseholdPerCapitaIncome,
            guardianMobileNumber:args.guardianMobileNumber,
            guardianEmail:args.guardianEmail,
            relationWithGuardian:args.relationWithGuardian,
            intendedCourse:args.intendedCourse,
            educationalAttainment:args.educationalAttainment,
            disability:args.disability,
            isIndigenousPerson:args.isIndigenousPerson

        })
    }

},
updateStudent: {
    type: StudentType,
    args: {
        _id: { type: GraphQLID },
        userId: { type: GraphQLID },
        lrn: { type: GraphQLNonNull(GraphQLString) },
        campusId: { type: GraphQLNonNull(GraphQLString) },
        admitType: {type:GraphQLString},
        typeOfStudent: {type:GraphQLString},
        firstName: {type:GraphQLString},
        middleName: {type:GraphQLString},
        lastName: {type:GraphQLString},
        extensionName: {type:GraphQLString},
        mobileNumber: {type:GraphQLString},
        landlineNumber: {type:GraphQLString},
        dateOfBirth: {type:GraphQLString},
        placeOfBirth: {type:GraphQLString},
        gender:{ type: GraphQLNonNull(GraphQLString) },
        citizenship: { type: GraphQLNonNull(GraphQLString) },
        houseNumber: { type: GraphQLNonNull(GraphQLString) },
        street: { type: GraphQLNonNull(GraphQLString) },
        barangay: { type: GraphQLNonNull(GraphQLString) },
        municipality: { type: GraphQLNonNull(GraphQLString) },
        province: { type: GraphQLNonNull(GraphQLString) },
        zipCode: { type: GraphQLNonNull(GraphQLString) },
        civilStatus:{ type: GraphQLNonNull(GraphQLString) },
        guardianName: { type: GraphQLNonNull(GraphQLString) },
        guardianAddress: { type: GraphQLNonNull(GraphQLString) },
        fathersName: { type: GraphQLNonNull(GraphQLString) },
        mothersName: { type: GraphQLNonNull(GraphQLString) },
        dswdHouseholdNumber: {type:GraphQLString},
        dswdHouseholdPerCapitaIncome: {type: GraphQLInt},
        guardianMobileNumber: { type: GraphQLNonNull(GraphQLString) },
        guardianEmail: { type: GraphQLNonNull(GraphQLString) },
        relationWithGuardian: { type: GraphQLNonNull(GraphQLString) },
        intendedCourse:{ type: GraphQLNonNull(GraphQLString) },
        educationalAttainment:{ type: GraphQLNonNull(GraphQLString) },
        disability:{type:GraphQLString},
        isIndigenousPerson:{type: GraphQLNonNull(GraphQLBoolean)},
    },
    resolve: (parent, args) => {
        return Student.findByIdAndUpdate(
            {_id: args._id},
             {
                 userId:args.userId,
                lrn: args.lrn, 
                campusId: args.campusId,
                admitType:args.admitType,
                typeOfStudent:args.typeOfStudent,
                firstName:args.firstName,
                middleName:args.middleName,
                lastName:args.lastName,
                extensionName:args.extensionName,
                mobileNumber:args.mobileNumber,
                landlineNumber:args.landlineNumber,
                dateOfBirth:args.dateOfBirth,
                placeOfBirth:args.placeOfBirth,
                gender:args.gender,
                citizenship:args.citizenship,
                houseNumber:args.houseNumber,
                street:args.street,
                barangay:args.barangay,
                municipality:args.municipality,
                province:args.province,
                zipCode:args.zipCode,
                civilStatus:args.civilStatus,
                guardianName:args.guardianName,
                guardianAddress:args.guardianAddress,
                fathersName:args.fathersName,
                mothersName:args.mothersName,
                dswdHouseholdNumber:args.dswdHouseholdNumber,
                dswdHouseholdPerCapitaIncome:args.dswdHouseholdPerCapitaIncome,
                guardianMobileNumber:args.guardianMobileNumber,
                guardianEmail:args.guardianEmail,
                relationWithGuardian:args.relationWithGuardian,
                intendedCourse:args.intendedCourse,
                educationalAttainment:args.educationalAttainment,
                disability:args.disability,
                isIndigenousPerson:args.isIndigenousPerson,
                updateStudent:Date.now
             })
    }
},
deleteStudent: {
    type: StudentType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const student = Student(args)
        return student.delete({_id: args._id})
    }
},
createMainCampus: {
    type: MainCampusType,
    args: {
        campusName: { type: GraphQLNonNull(GraphQLString) },
        schoolName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        mobileNumber: { type: GraphQLNonNull(GraphQLString) },
        currency: { type: GraphQLNonNull(GraphQLString) },
        currencySymbol: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        state: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },

    },
    resolve: (parent, args) => {
        const mainCampus = MainCampuses(args)
        return mainCampus.save({
        campusName: args.campusName,
        schoolName: args.schoolName,
        email: args.email,
        mobileNumber: args.mobileNumber,
        currency: args.currency,
        currencySymbol: args.currencySymbol,
        city: args.city,
        state: args.state,
        address: args.address
        })
    }
},
updateMainCampus: {
    currentDate:Date.now,
    type: MainCampusType,
    args: {
        _id: { type: GraphQLID },
        campusName: { type: GraphQLNonNull(GraphQLString) },
        schoolName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        mobileNumber: { type: GraphQLNonNull(GraphQLString) },
        currency: { type: GraphQLNonNull(GraphQLString) },
        currencySymbol: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        state: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: (parent, args) => {
        return MainCampuses.findByIdAndUpdate({_id: args._id}, {
        campusName: args.campusName,
        schoolName: args.schoolName,
        email: args.email,
        mobileNumber: args.mobileNumber,
        currency: args.currency,
        currencySymbol: args.currencySymbol,
        city: args.city,
        state: args.state,
        address: args.address,
        updatedAt: new Date()
        })
    }
},
deleteMainCampus: {
    type: MainCampusType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const mainCampus = MainCampuses(args)
        return mainCampus.delete({_id: args._id})
    }
},
createSateliteCampus: {
    type: SatelliteCampusType,
    args: {
        campusName: { type: GraphQLNonNull(GraphQLString) },
        mainCampusId: { type: GraphQLNonNull(GraphQLID) },
        schoolName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        mobileNumber: { type: GraphQLNonNull(GraphQLString) },
        currency: { type: GraphQLNonNull(GraphQLString) },
        currencySymbol: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        state: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },

    },
    resolve: (parent, args) => {
        const sateliteCampus = SatelliteCampuses(args)
        return sateliteCampus.save({
        campusName: args.campusName,
        mainCampusId:args.mainCampusId,
        schoolName: args.schoolName,
        email: args.email,
        mobileNumber: args.mobileNumber,
        currency: args.currency,
        currencySymbol: args.currencySymbol,
        city: args.city,
        state: args.state,
        address: args.address
        })
    }
},
updateSateliteCampus: {
    type: SatelliteCampusType,
    args: {
        _id: { type: GraphQLID },
        campusName: { type: GraphQLNonNull(GraphQLString) },
        mainCampusId: { type: GraphQLNonNull(GraphQLID) },
        schoolName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        mobileNumber: { type: GraphQLNonNull(GraphQLString) },
        currency: { type: GraphQLNonNull(GraphQLString) },
        currencySymbol: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        state: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: (parent, args) => {
        return SatelliteCampuses.findByIdAndUpdate({_id: args._id}, {
        campusName: args.campusName,
        mainCampusId:args.mainCampusId,
        schoolName: args.schoolName,
        email: args.email,
        mobileNumber: args.mobileNumber,
        currency: args.currency,
        currencySymbol: args.currencySymbol,
        city: args.city,
        state: args.state,
        address: args.address,
        updatedAt: new Date()
        })
    }
},
deleteSateliteCampus: {
    type: SatelliteCampusType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const sateliteCampus = SatelliteCampuses(args)
        return sateliteCampus.delete({_id: args._id})
    }
},
createUser: {
    type: UserType,
    args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        userType: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: (parent, args) => {
        const user = User(args)
        return user.save({
        email:args.email,
        password:args.password,
        userType:args.userType
        })
    }
},
updateUser: {
    type: UserType,
    args: {
        _id: { type: GraphQLID },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        userType: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: (parent, args) => {
        return User.findByIdAndUpdate({_id: args._id}, {
            email:args.email,
            password:args.password,
            userType:args.userType,
             updatedAt: new Date()
        })
    }
},
deleteUser: {
    type: UserType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const user = User(args)
        return user.delete({_id: args._id})
    }
},