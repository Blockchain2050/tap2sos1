module.exports = (sequelize, DataTypes) => {
    const tempUser = sequelize.define("tempuser", {
      
      username: {
        type: DataTypes.STRING,
        //field: 'tempUser'
      },
      }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      
    });
  
    return tempUser;
  };