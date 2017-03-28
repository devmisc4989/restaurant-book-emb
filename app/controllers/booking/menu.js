
import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    this.send('pull');
  },

  actions: {

    pull: function() {
      var that = this;
      var id = window.location.href.split("/")[5];
      var input_index = window.location.href.split("/")[6];
      var menu_index = window.location.href.split("/")[7];

      var products_array = [];
      var menus = [];

      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + id,
         success: function(booking) {

           for (var k=0; k<booking.inputs[input_index].selections.length; k++) {
             menus.push({
               name: booking.inputs[input_index].selections[k].title,
               menu_index: k,
               id: id,
               input_index: input_index
             });
           }

           var items = [];

           for (var i=0; i < items.length; i++) {
             items[i].position = i;
           }

           that.set('menus', menus);
           that.set('booking', booking);
           that.set('menu', booking.inputs[input_index].selections[menu_index]);
           that.set('items', booking.inputs[input_index].selections[menu_index].items);
           that.set('menu_items', JSON.stringify(booking.inputs[input_index].selections[menu_index].items));
           that.set('booking_inputs', JSON.stringify(booking.inputs));
           that.set('active', 'undefined');
           that.set('collapsible', {
             state: 'cc-hide',
             active: false
           });

           Ember.$.ajax({
              type:"GET",
              headers: {'Authorization': that.get('session.data.authenticated.authorization')},
              dataType: 'json',
              url: ENV.API.domain + "/product",
              success: function(products) {
                console.log(products);
                for(var j=0; j<products.length; j++){
                    products_array.push({
                      name: products[j].id,
                      title: products[j].title,
                      description: products[j].description
                    });
                }

                that.set('products', products_array);
                that.set('all_products', JSON.stringify(products_array));
              },
              error: function(products) {
                console.log(products);
                that.toast.error('Error finding customer', '', {positionClass: 'toast-top-full-width toast-fullnav'});
              },
            });
         },
         error: function(data) {
           alert("failed");
         },
       });
    },

    typeahead: function(products, index) {
      products = JSON.parse(products);
      var query = Ember.$('#' + index + '-title').val();

      var filter = [];

      for (var i=0; i<products.length; i++) {
        if (products[i].title.includes(query)) {
          filter.push(products[i]);
        }
      }

      if (query.length > 2) {
        $('#' + index + '-products-list').show();
        this.set('products', filter);
      } else {
        $('#' + index + '-products-list').show();
        this.set('products', products);
      }

    },

    filterContent: function(){
      return true;
    },

    updatePriceDescription: function(items, index, price_index) {
      items = JSON.parse(items);
      items[index].prices[price_index].description = Ember.$('#' + price_index + '-price-description').val();
      this.set('menu_items', JSON.stringify(items));
    },

    updatePriceAmount: function(items, index, price_index) {
      items = JSON.parse(items);
      items[index].prices[price_index].amount = Ember.$('#' + price_index + '-price-amount').val();
      this.set('menu_items', JSON.stringify(items));
    },

    clearPriceDescription: function(price_index) {
      console.log("running");
      $("#" + price_index + "-price-description").val('');
    },

    toggleCollapse: function(state){
      if (state) {
        $("#options-summary").show();
        this.set('collapsible', {
          state: 'cc-hide',
          active: false
        });
      } else {
        $("#options-summary").hide();
        this.set('collapsible', {
          state: 'cc-show',
          active: true
        });
      }
    },

    addSelectedItem(product_id, index, items) {
      var that = this;

      items = JSON.parse(items);

      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/product/" + product_id,
         success: function(data) {
          console.log(data);

          items[index].title = data.title;
          items[index].description = data.description;
          items[index].product = data.id;

          that.set('items', items);
          that.set('menu_items', JSON.stringify(items));

         },
         error: function(data) {
           console.log(data);
           that.toast.error('Error finding product', '', {positionClass: 'toast-top-full-width toast-fullnav'});
         },
       });

    },

    click: function(index) {
      $("#card-" + index).addClass("popout");
      var position = $("#card-" + index).position();
      console.log(position);
      $("#action-bar").css({
          position: "absolute",
          top: position.top + "px"
      }).show();
      this.set('active', index);
      $("#options-summary").show();
    },

    clickproducts: function(index, products) {

      this.set('collapsible', {
        state: 'cc-hide',
        active: false
      });

      console.log(index);
      $("#card-" + index).addClass("popout");
      var position = $("#card-" + index).position();
      var products_array = [];
      $("#action-bar").css({
          position: "absolute",
          top: position.top + "px"
      }).show();
      for(var j=0; j<products.length; j++){
        if (products[j].name.includes(":")) {
          products_array.push({
            name: products[j].name.split(":")[0] + ":" + index,
            title: products[j].title,
            description: products[j].description
          });
        } else {
          products_array.push({
            name: products[j].name + ':' + index,
            title: products[j].title,
            description: products[j].description
          });
        }
      }
      this.set('products', products_array);
      this.set('active', index);
      $("#options-summary").show();
    },

    drop: function(data) {

      Array.prototype.move = function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
       this.splice(new_index, 0, this.splice(old_index, 1)[0]);
      };

      var items = JSON.parse(data.items);
      items.move(data.old_index, data.new_index);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
      this.set('active', data.new_index);
    },

    focusOutItem: function(index) {
      Ember.$('#' + index + '-product').val('');
      Ember.$("#" + index + "-form").submit();
    },

    focusOut: function(index) {
      Ember.$("#" + index + "-form").submit();
    },

    focusOutSelection: function(item_i,option_i, selection_i) {
      Ember.$("#" + item_i + option_i + selection_i + "-selection-form").submit();
    },

    focusOutOption: function(item_i, option_i) {
      console.log('running focus out');
      Ember.$("#" + item_i + option_i + "-option-form").submit();
    },

    move: function(items, index, new_index) {
      Array.prototype.move = function (old_index, new_index) {
        console.log(old_index + ", " + new_index);
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
      };

      // CODE STARTS HERE
      items = JSON.parse(items);
      items.move(index, index + new_index);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
      this.set('active', index + new_index);
    },

    // PRICE FUNCTIONS

    addPrice: function(items, index) {
      items = JSON.parse(items);

      if (!items[index].prices) {
        items[index].prices = [];
      }

      var data = {
        description: "",
        amount: "",
        position: items[index].prices.length
      };

      console.log(data.position);

      items[index].prices.push(data);
      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    deletePrice: function(items, index, i) {
      items = JSON.parse(items);
      items[index].prices.splice(i, 1);
      for (var j=0; j < items[index].prices.length; j++) {
        items[index].prices[j].position = j;
      }
      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    // OPTION FUNCTIONS

    addOption: function(items, index) {
      items = JSON.parse(items);

      if (!items[index].options) {
        items[index].options = [];
      }

      var data = {
        description: "",
        selection: [],
        type: "addition",
        amount: "",
        position: items[index].options.length
      };

      console.log(data);

      items[index].options.push(data);
      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    updateOption: function(items, item_i, index) {
      items = JSON.parse(items);
      items[item_i].options[index].description = Ember.$('#' + item_i + index + '-option-description').val();
      items[item_i].options[index].amount = Ember.$('#' + item_i + index + '-option-amount').val();
      items[item_i].options[index].type = Ember.$('#' + item_i + index + '-option-type').val();
      this.set('menu_items', JSON.stringify(items));
    },

    deleteOption: function(items, index, i) {
      items = JSON.parse(items);

      console.log(items[index]);

      items[index].options.splice(i, 1);
      for (var j=0; j < items[index].options.length; j++) {
        items[index].options[j].position = j;
      }
      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    deleteSelection: function(items, item_i, option_i, selection_i) {
      items = JSON.parse(items);
      items[item_i].options[option_i].selection.splice(selection_i, 1);
      for (var j=0; j < items[item_i].options[option_i].selection.length; j++) {
        items[item_i].options[option_i].selection[j].position = j;
      }
      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    // MENU PUBLISH / DRAFT / SAVE

    saveChanges: function(inputs, items) {

      var inputs = JSON.parse(inputs);
      var items = JSON.parse(items);

      console.log(inputs);

      var that = this;

      var booking_id = window.location.href.split("/")[5];
      var input_index = window.location.href.split("/")[6];
      var menu_index = window.location.href.split("/")[7];

      inputs[input_index].selections[menu_index].items = items;
      inputs[input_index].selections[menu_index].title = Ember.$('#menu-title').val();
      inputs[input_index].selections[menu_index].description = Ember.$('#menu-description').val();


      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Menu updated', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },


    publish: function(business_id, menu_id) {

      var data = {
        is_published: true
      };

      var that = this;

      console.log(data);

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/menu/" + menu_id,
         data: data,
         success: function(data) {
           that.set('menu', data);
           that.set('items', data.items);
           that.set('menu_items', JSON.stringify(data.items));
           that.toast.success('Menu published.', '', {positionClass: 'toast-top-full-width toast-subnav'});
         },
         error: function(data) {
           console.log(data);
           alert("failed");
         },
       });
    },

    draft: function(business_id, menu_id) {

      var data = {
        is_published: false
      };

      var that = this;

      console.log(data);

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/menu/" + menu_id,
         data: data,
         success: function(data) {
           that.set('menu', data);
           that.set('items', data.items);
           that.set('menu_items', JSON.stringify(data.items));
           that.toast.success('Menu drafted.', '', {positionClass: 'toast-top-full-width toast-subnav'});
         },
         error: function(data) {
           console.log(data);
           alert("failed");
         },
       });
    },

    // MENU ITEM

    addSubItem: function(items, index) {

      items = JSON.parse(items);

      var item = {
        title: "",
        description : "",
        type: "sub-item",
        options: [],
        prices: [
          {
            description: "",
            amount: "",
            position: 0
          }
        ],
      };

      items.splice(index + 1, 0, item);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      console.log(items);

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
      this.set('active', index + 1);
    },

    addItem: function(items, active) {
      items = JSON.parse(items);

      var item = {
        title: "",
        description : "",
        type: "item",
        options: [],
        prices: [
          {
            description: "",
            amount: "",
            position: 0
          }
        ],
        product: ""
      };

      console.log(item);

      items.splice(parseInt(active) + 1, 0, item);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      console.log(items);

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
      this.set('active', active + 1);
    },

    updateItem: function(items, index) {
      items = JSON.parse(items);

      items[index].title = Ember.$('#' + index + '-title').val();
      items[index].description = Ember.$('#' + index + '-description').val();
      items[index].product = Ember.$('#' + index + '-product').val();

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
      $('#' + index + '-products-list').hide();
    },


    addProduct: function(index, business, products, items) {
      var that = this;

      console.log(index);
      items = JSON.parse(items);
      products = JSON.parse(products);
      $('#' + index + '-products-list').hide();

      var data = {
        title: Ember.$('#' + index + '-title').val(),
        description: Ember.$('#' + index + '-description').val(),
        business: business
      };

      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/product",
         data: data,
         success: function(data) {
           console.log(data);

           items[index].title = data.title;
           items[index].description = data.description;
           items[index].product = data.id;

           products.push({
             name: data.id,
             title: data.title,
             description: data.description
           });

           that.set('products', products);
           that.set('items', items);
           that.set('menu_items', JSON.stringify(items));
           that.set('all_products', JSON.stringify(products));

           that.toast.success('Product added', '', {positionClass: 'toast-top-full-width toast-subnav'});
         },
         error: function(data) {
           that.toast.error('Menu couldn\'t be saved, as you have empty items. Complete items and try again.', '', {positionClass: 'toast-top-full-width toast-subnav'});
         },
       });

    },



    deleteProduct: function(index, product_id, items, products) {
      var that = this;

      items = JSON.parse(items);
      products = JSON.parse(products);

      console.log(product_id);

      for (var j=0; j < products.length; j++) {
        if (products[j].name == product_id) {
          products.splice(j, 1);
          break;
        }
      }

      items.splice(parseInt(index), 1);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      that.set('items', items);
      that.set('menu_items', JSON.stringify(items));
      that.set('products', products);
      that.set('all_products', JSON.stringify(products));
      that.set('active', index);

      Ember.$.ajax({
         type:"DELETE",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/product/" + product_id,
         success: function(data) {
           that.toast.success('Product deleted', '', {positionClass: 'toast-top-full-width toast-subnav'});
         },
         error: function(data) {
           that.toast.error('Error occued when deleting product.', '', {positionClass: 'toast-top-full-width toast-subnav'});
         },
       });

    },


    // MENU NOTES

    addNote: function(items, active) {
      items = JSON.parse(items);

      var item = {
        note: "",
        type: "note"
      };

      items.splice(parseInt(active) + 1, 0, item);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    updateNote: function(items, index) {
      items = JSON.parse(items);

      items[index].note = Ember.$('#' + index + '-note').val();

      this.set('menu_items', JSON.stringify(items));

    },

    // MENU CATEGORY

    updateCategory: function(items, index) {
      items = JSON.parse(items);

      items[index].title = Ember.$('#' + index + '-title').val();
      items[index].description = Ember.$('#' + index + '-description').val();

      this.set('menu_items', JSON.stringify(items));

    },

    addCategory: function(items) {
      items = JSON.parse(items);

      var item = {
        title: "",
        description: "",
        type: "group",
        options: [],
        groups: [],
        prices: [
          {
            description: "",
            amount: "",
            position: 0
          }
        ],
      };

      items.unshift(item);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      console.log(items);

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    addSubCategory: function(items, index) {

      items = JSON.parse(items);

      var item = {
        title: "",
        description : "",
        prices: [
          {
            description: "",
            amount: "",
            position: 0
          }
        ],
        type: "sub-group"
      };

      items.splice(index + 1, 0, item);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      console.log(items);

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
      this.set('active', index + 1);
    },

    deleteItem: function(items, i) {
      items = JSON.parse(items);

      console.log(i);

      items.splice(i, 1);

      for (var i=0; i < items.length; i++) {
        items[i].position = i;
      }

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },

    addSelection: function(items, item_i, option_i) {
      items = JSON.parse(items);

      if (!items[item_i].options[option_i].selection) {
        items[item_i].options[option_i].selection = [];
      }

      var item = {
        amount: "",
        description : "",
        position: items[item_i].options[option_i].selection.length
      };

      items[item_i].options[option_i].selection.push(item);

      console.log(items[item_i].options[option_i].selection);

      this.set('items', items);
      this.set('menu_items', JSON.stringify(items));
    },


    updateSelection: function(items, item_i, option_i, index) {
      items = JSON.parse(items);
      console.log("running");
      console.log(Ember.$('#' + option_i + index + '-selection-amount').val());

      items[item_i].options[option_i].selection[index].amount = Ember.$('#' + item_i + option_i + index + '-selection-amount').val();
      items[item_i].options[option_i].selection[index].description = Ember.$('#' + item_i + option_i + index + '-selection-description').val();

      this.set('menu_items', JSON.stringify(items));

    },

  }

});
