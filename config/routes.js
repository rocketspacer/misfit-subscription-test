/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': function (req, res) {
    var uid = req.session.me;
    sails.log.info(req.session);
    if (uid) {
      var user, fitness;
      sails.log.info('Found UID in session: ' + uid);
      User.findOne({uid: uid})
        .then(function (result) {
          user = result;
          sails.log.info(user);
          let fitnessPromise = Fitness.find({where: {uid: uid}, sort: 'date ASC'});
          let sleepPromise = Sleep.find({where: {uid: uid}, sort: 'date ASC'});
          let devicePromise = Device.find({where: {uid: uid}});
          return Promise.all([fitnessPromise, sleepPromise, devicePromise]);
        })
        .then(function (values) {
          console.log(values);
          res.view('homepage', {user: user, fitness: values[0], sleep: values[1], device: values[2]});
        })
        .catch(function (err) {
          if (err) {
            sails.log.error(err);
            res.json(502, {
              error: err
            })
          }
        });
    } else {
      sails.log.info('UID not found');
      res.view('homepage', {user: null, fitness: null});
    }
  }

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
