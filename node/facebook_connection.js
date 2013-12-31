var usersById = {};
var nextUserId = 0;

function addUser(source, sourceUser){
    var user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
    return user;
}

var usersByFbId = {};

//configure facebook oauth
everyauth.debug = true;
everyauth.facebook
  .appId(conf.fb.appId)
  .appSecret(conf.fb.appSecret)
  .findOrCreateUser(function(session, accessToken, accessTokExtra, md){
    return usersByFbId[md.id] || (usersByFbId[md.id] = addUser('facebook', md));
  })
  .redirectPath('/');

//accessing the user
everyauth.everymodule.findUserById(function(req, userId, callback) {
  callback(null, usersById[userId]);
});
