const express = require('express');
const app = express();


//database
const { db, Hospital, Hospital_Slots, Vac_Appts, Users } = require('./db');
const session = require('express-session');

app.use(session({
    secret: 'devrev',
    resave: false,
    saveUninitialized: true
}))


//middlewares for data exchange in proper format, in post requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'hbs');

app.use("/", express.static(__dirname + '/public'));




// signup
app.post('/signup', (req, res) => {
    if (req.body.name && req.body.city && req.body.dob && req.body.phone && req.body.email && req.body.aadhaar && req.body.pass) {
        // if(req.session) req.session.destroy((err)=>{
        //     if (err) throw err;
        // })
        Users.create({
            name: req.body.name,
            city: req.body.city,
            dob: req.body.dob,
            email: req.body.email,
            phone: req.body.phone,
            aadhaar: req.body.aadhaar,
            password: req.body.pass
        }).then((user) => {
            req.session.email = user.email;
            req.session.name = user.name;
            req.session.phone = user.phone;
            req.session.city = user.city;
            req.session.dob = user.dob;
            req.session.aadhaar = user.aadhaar;
            req.session.user_logged_in = true;
            res.sendFile(__dirname + '/public/dashboard.html');
        }).catch((error) => {
            //throw error;
            return res.render('error', { error, text: "Some error occured, while adding! Please try again." });
        })
    }
    else {
        return res.render('error', { error: "Please enter all details to signup!" });
    }
})

// login
app.post('/login', (req, res) => {
    if (req.body.email && req.body.pass) {
        // if(req.session) req.session.destroy((err)=>{
        //     if (err) throw err;
        // })
        Users.findOne({
            where: { email: req.body.email }
        }).then((user) => {
            if (!user) {
                return res.render('error', { error: "Account does not exist! Please try logging in again with correct email." });
            }
            else if (user.password == req.body.pass) {
                //  then we should create a cookie with userID and redirect to profile
                req.session.email = user.email;
                req.session.name = user.name;
                req.session.phone = user.phone;
                req.session.city = user.city;
                req.session.dob = user.dob;
                req.session.aadhaar = user.aadhaar;
                req.session.user_logged_in = true;
                res.sendFile(__dirname + '/public/dashboard.html');
            }
            else {
                return res.render('error', { error: "Invalid E-mail or Password! Please try logging in again with correct details." });
            }
        }).catch((error) => {
            console.log(error);
            return res.render('error', { error, text: "Some error occurred! Please try logging in again." });
        })
    }

    else {
        return res.render('error', { error: "Please enter all details to login!" });
    }
})

app.get('/is_logged_in', (req, res) => {
    if (req.session.user_logged_in) {
        return res.send({ val: true });
    }
    else {
        return res.send({ val: false });
    }
})

app.get('/user_email', (req, res) => {
    if (req.session.user_logged_in) {
        return res.send({ user_email: req.session.email });
    }
    else {
        return res.send({ user_email: "user not logged in" });
    }
})

// log out
app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) return res.render('error', { err });
            return res.redirect('/');
        })
    }
    else {
        return res.redirect('/');
    }
})

// admin login
app.post('/admin_login', (req, res) => {
    if (req.body.email && req.body.pass) {
        // if(req.session) req.session.destroy((err)=>{
        //     if (err) throw err;
        // })
        if (req.body.email == "lagan@gmail.com" && req.body.pass == "lagan1234") {
            req.session.admin_logged_in = true;
            res.sendFile(__dirname + '/public/admin_dashboard.html');
        }
        else {
            return res.render('error', { error: "Invalid E-mail or Password! Please try logging in again with correct details." });
        }
    }
    else {
        return res.render('error', { error: "Please enter all details to login!" });
    }
})
app.get('/admin_logged_in', (req, res) => {
    if (req.session.admin_logged_in) {
        return res.send({ val: true });
    }
    else {
        return res.send({ val: false });
    }
})

// add hospital
app.post('/add_hospital', (req, res) => {
    // insert check to see for repeat
    if (req.body.name && req.body.city && req.body.locality && req.body.phone && req.body.contact_person && req.body.amb_phone && req.body.bed_cnt) {
        Hospital.create({
            name: req.body.name,
            locality: req.body.locality,
            city: req.body.city,
            contact_person: req.body.contact_person,
            phone: req.body.phone,
            amb_phone: req.body.amb_phone,
            bed_count: req.body.bed_cnt
        }).then((user) => {
            return res.send({ val: "success" });
        }).catch((error) => {
            //throw error;
            return res.render('error', { error, text: "Some error occured, while adding! Please try again." });
        })
    }
    else {
        return res.render('error', { error: "Please enter all details to add a hospital!" });
    }
})

// show all hospitals
app.get('/show_hospitals', (req, res) => {
    Hospital.findAll()
        .then((data) => {
            return res.send(data);
        })
        .catch((err) => {
            return res.render('error', { err });
        })
})


// add slots for hosp if possible
app.post('/add_slots', (req, res) => {
    if (req.body.date && req.body.id) {
        Hospital_Slots.findOne({
            where: { hospital_id: req.body.id, date: req.body.date }
        })
            .then((data) => {
                if (!data) {
                    Hospital_Slots.create({
                        hospital_id: req.body.id,
                        date: req.body.date
                    }).then((s) => {
                        return res.send({ val: "Success!" });
                    }).catch((error) => {
                        //throw error;
                        return res.render('error', { error, text: "Some error occured, while adding! Please try again." });
                    })
                }
            }).catch((err) => {
                return res.render('error', { err });
            })
    }
    else {
        res.render('error', { error: "Please enter all details to add slots!" });
    }
})



// get slots for particular date and hospital
app.post('/getslots', (req, res) => {
    if (req.body.hosp_id && req.body.apt_date) {
        Hospital_Slots.findOne({
            where: { hospital_id: req.body.hosp_id, date: req.body.apt_date }
        })
            .then((data) => {
                console.log(data);
                if (!data) {
                    return res.send("111111111111");
                }
                return res.send(data.slots);
            })
            .catch((err) => {
                return res.render('error', { err });
            })
    }
    else {
        return res.render('error', { error: "Please enter all details to find slots!" });
    }
})

// book vaccination appt
app.post('/book_vac_appt', (req, res) => {
    if (req.body.email && req.body.date && req.body.slot && req.body.hospital_id) {
        Vac_Appts.create({
            email: req.body.email,
            hospital_id: req.body.hospital_id,
            appt_date: req.body.date,
            appt_slot: req.body.slot
        }).then((apt) => {
            //update slot info
            Hospital_Slots.findOne({
                where: { hospital_id: req.body.hospital_id, date: req.body.date }
            })
                .then((hosp_slot) => {
                    slot_string = hosp_slot.slots;
                    new_string = slot_string.substring(0, req.body.slot - 1) + '1' + slot_string.substring(req.body.slot);
                    Hospital_Slots.update({ slots: new_string }, {
                        where: {
                            hospital_id: req.body.hospital_id, date: req.body.date
                        }
                    });
                    return red.send("Success!");
                })
                .catch((error) => {
                    return res.render('error', { error });
                })

            // return red.send("Success!");
            // res.sendFile(__dirname + '/public/admin_page.html');
        }).catch((error) => {
            //throw error;
            return res.render('error', { error, text: "Some error occured! Please try again." });
        })
    }
    else {
        return res.render('error', { error: "Please enter all details to book vaccination appointment!" });
    }
})




// get user profile
app.get('/get_user_details', (req, res) => {
    if (!req.session) {
        return res.send({ err: "Pl login first!" });
    }
    let email = req.session.email;
    let name = req.session.name;
    let phone = req.session.phone;
    let city = req.session.city;
    let dob = req.session.dob;
    let aadhaar = req.session.aadhaar;
    return res.send({ email, name, phone, city, dob, aadhaar });
})
app.get('/get_user_vacs', (req, res) => {
    if (!req.session) {
        return res.send({ err: "Pl login first!" });
    }
    let email = req.session.email;
    Vac_Appts.findOne({
        where: { email: email }
    })
        .then((data) => {
            Hospital.findOne({
                where: { id: data.hospital_id }
            })
                .then((data2) => {
                    return res.send({ d1: data, d2: data2, found: true });
                })
                .catch((err) => {
                    return res.render('error', { err });
                })
        })
        .catch((err) => {
            return res.send({ found: false });
        })
})






// find all vac appts for particular hospi
app.post('/get_hosp_vacs', (req, res) => {
    if (!req.session) {
        return res.send({ err: "Pl login first!" });
    }
    let hospital_id = req.body.id;
    Vac_Appts.findAll({
        where: { hospital_id: hospital_id }
    })
        .then((data) => {
            return res.send({ data, found: true });
        })
        .catch((err) => {
            return res.send({ found: false });
        })
})




// mark appt as complete
app.post('/complete_vac', (req, res) => {
    if (req.body.email) {
        Vac_Appts.update({ status: "Completed" }, {
            where: {
                email: req.body.email
            }
        })
            .then(() => {
                return res.send("Success!");
            })
            .catch((err) => {
                return res.render('error', { error: "here3" });
            });
    }
    else {
        return res.render('error', { error: "Please enter all details to update appt!" });
    }
})

//syncing db
const port = process.env.PORT||4444;
db.sync()
    .then(() => {
        app.listen(port, () => {
            console.log("Server started successfully at http://localhost:4444 ");
        })
    })
