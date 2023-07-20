const sequelize = require('sequelize');

const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/database.db'
});

// table for hospitals
const Hospital = db.define('hospital', {

    name: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    locality: {
        type: sequelize.STRING(30),
        allowNull: false
    },

    city: {
        type: sequelize.STRING(30),
        allowNull: false
    },

    phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    contact_person: {
        type: sequelize.STRING(50),
        allowNull: false
    },

    amb_phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    bed_count: {
        type: sequelize.NUMBER,
        allowNull: false
    }
})

// table for hospital slots for vaccination 
const Hospital_Slots = db.define('hospital_slots', {
    hospital_id: {
        type: sequelize.INTEGER,
        allowNull: false
    },

    date: {
        type: sequelize.DATEONLY,
        allowNull: false
    },

    slots: {
        type: sequelize.STRING(12),
        defaultValue: "000000000000"
    }
})

// table for users 
const Users = db.define('users', {

    name: {
        type: sequelize.STRING(50),
        allowNull: false,
    },

    city: {
        type: sequelize.STRING(30),
        allowNull: false
    },

    dob: {
        type: sequelize.DATEONLY,
        allowNull: false
    },

    phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    email: {
        type: sequelize.STRING(60),
        allowNull: false,
        primaryKey: true
    },

    aadhaar: {
        type: sequelize.STRING(13),
        allowNull: false,
        unique: true,
    },

    password: {
        type: sequelize.STRING(20),
        allowNull: false
    }
})

// table for vaccination appointments
const Vac_Appts = db.define('vac_appts', {

    email: {
        type: sequelize.STRING(60),
        allowNull: false,
        primaryKey: true
    },

    hospital_id: {
        type: sequelize.INTEGER
    },

    appt_date: {
        type: sequelize.DATEONLY,
        allowNull: false
    },

    appt_slot: {
        type: sequelize.INTEGER,
        allowNull: false
    },

    type: {
        type: sequelize.STRING(10),
        defaultValue: "FIRST"
    },

    status: {
        type: sequelize.STRING(20),
        defaultValue: "Pending"
    }
})



module.exports = {
    db, Hospital, Hospital_Slots, Vac_Appts, Users
}