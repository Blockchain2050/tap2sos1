module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      //allowNull: true 
    }, 
    username: {
      type: DataTypes.STRING,
      //field: 'company_name'
    },
    email: {
      type: DataTypes.STRING,
      //field: 'company_name'
    },
    surname: {
      type: DataTypes.STRING,
      //field: 'company_name'
    },
    name: {
      type: DataTypes.STRING,
    },
    middleName: {
      type: DataTypes.STRING

    },
    sexid: {
      type: DataTypes.STRING
      
    },
    amka: {
      type: DataTypes.INTEGER,
      //allowNull: true 
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: true 
      
    },
    address: {
      type: DataTypes.STRING,

    },
    phone: {
      type: DataTypes.STRING

    },
    emergencyPhone: {
      type: DataTypes.STRING

    },
    doctorsPhone: {
      type: DataTypes.STRING
    },
    medicalCondition: {
      type: DataTypes.STRING
    },
    bloodType: {
      type: DataTypes.STRING
    },
    medication: {
      type: DataTypes.STRING
    },
    allergies: {
      type: DataTypes.STRING
      
    },
    organDonor: {
      type: DataTypes.STRING,
      defaultValue:null, 
      
    },
    hash: {
      type: DataTypes.STRING
    }
    }, {
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    
  });

  return User;
};