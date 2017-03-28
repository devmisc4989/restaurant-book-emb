import EmberUploader from 'ember-uploader';
import ENV from '../config/environment';

export default EmberUploader.FileField.extend({

  session: Ember.inject.service('session'),

  filesDidChange: function(files) {
    console.log('running');
    var that = this;

    var inputs = JSON.parse(this.get('inputs'));
    var index = this.get('index');
    var id = this.get('id');

    console.log(index);
    console.log(id);

    const uploader = EmberUploader.Uploader.create({
      ajaxSettings: {
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        }
      },
      url: ENV.API.domain + '/booking/upload',
      method: 'POST'
    });

    if (!Ember.isEmpty(files)) {
      console.log("--files--", files);
      
      uploader.upload(files[0]).then(data => {

        console.log("---after upload---", data);
        inputs[index].value = data;
        /*
        Ember.$.ajax({
           type:"PUT",
           headers: {'Authorization': that.get('session.data.authenticated.authorization')},
           dataType: 'json',
           url: ENV.API.domain + "/booking/" + id,
           data: {inputs: inputs},
           success: function(booking) {
             window.location.href = '/booking/details/' + id;
           },
           error: function(data) {
             console.log("error: " + data);
           },
         });
      */

      }, error => {
        console.log("error occured");
      });
    }
  }
});
