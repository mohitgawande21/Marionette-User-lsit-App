
var app = new Marionette.Application()

var userModel = Backbone.Model.extend({})

var usersColletion = Backbone.Collection.extend({
    model: userModel,
    url: 'https://jsonplaceholder.typicode.com/users'
})
var formView = Marionette.ItemView.extend({
    template: _.template($('#formTemplate').html()),
    events: {
        'click  #input-btn': 'inputbtn',
        'click  #delete-sel-btn': 'deleteselbtn',
        'click  #checkboxall-input': 'checkboxallinput'
    },
    inputbtn: function () {
        var usermodel = new userModel({
            name: $('#input-name').val(),
            email: $('#input-email').val(),
        });
        this.collection.add(usermodel)
        $('#input-name').val("")
        $('#input-email').val("")
    },
    deleteselbtn: function () {
        var filterdAppcolletion = _.filter(this.collection.toJSON(), function (model) {
            if (model.selected !== true) {
                return model
            }
        })
        this.collection.set(filterdAppcolletion)
    },
    checkboxallinput: function (e) {
        var $target = $(e.target)
        var selected = $target.is(':checked');
        var filterdAppcolletion = _.each(this.collection.toJSON(), function (model) {
            model.selected = selected
            return model
        })
        this.collection.set(filterdAppcolletion)
        const iteratecheckbox = document.querySelectorAll('#checkbox-input')
        if (selected) {
            iteratecheckbox.forEach((box) => {
                box.setAttribute('checked', 'true')
                $('div#user-li').css("color", "red")
            });

        }
        else {
            iteratecheckbox.forEach((box) => {
                box.removeAttribute('checked')
                $('div#user-li').css("color", "black")
            });
        }
    }
})

var userView = Marionette.ItemView.extend({
    template: _.template($('#userTemplate').html()),
    id: 'user-li',
    padding: '10px',
    events: {
        'click #delete-btn': 'deleteUser',
        'click #checkbox-input': 'checked',
        'click #edit-btn':'editUser',
        'click #update-btn':'updateUser'
    },
    attributes: function () {
        var padding = '10px'
        return {
            'style': `padding:${padding}; background-color: rgba(255, 255, 200, 0.8);border: 5px solid white`
        };
    },
    deleteUser: function () {
        this.model.destroy()
    },
    checked: function (e) {
        var $target = $(e.target)
        var selected = $target.is(':checked');
        if (selected) {
            this.$('p').css("color", "red")
            this.$('input').attr('checked', 'true')
        }
        else {
            this.$('p').css("color", "black")
            this.$('input').removeAttr('checked', 'false')
        }
       this.model.set("selected", selected)

    },
    editUser:function(){
       this.$('#update-btn').show()
       this.$('#edit-btn').hide()
        var name=this.$('.name').html()
        var email=this.$('.email').html()
        console.log("click edit",name,email)
        this.$('.name').html(`<input class=editname type=text > `)
        this.$('.email').html(`<input class=editemail type=text> `)
        this.$('.editname').val(name)
        this.$('.editemail').val(email)
    },
    updateUser:function(){
        this.$('#update-btn').hide()
        this.$('#edit-btn').show()
        this.$('.name').html($('.editname').val())
        this.$('.email').html($('.editemail').val())
    }
})

var usersColletionView = Marionette.CollectionView.extend({
    childView: userView,
    tagName: 'ul',
    id:'user-ul',
    attributes: function () {
        var padding = '10px'
        return {
            'style': `display:grid; grid-template-columns: auto auto auto;padding:${padding};`,
        };
    },
    initialize: function () {
        this.collection.fetch({
            success: function () {
                console.log('fetched')
            },
            error: function () {
                console.log('failed')
            },
        })
    },
})

var searchView=Marionette.ItemView.extend({
    template:_.template($('.searchTemplate').html()),
    events:{
        'change .search-input':'searchUser'
    },
    searchUser:function(){
        console.log('change search')
    }

})

app.addRegions({
    list: '#list',
    form: '#form',
    search:'.search',
})

$(document).ready(function () {
    app.addInitializer(function () {
        var appcolletion = new usersColletion([
            // {
            //     name: "Mohit",
            //     email: "mohit@gmail.com"
            // }, {
            //     name: "Mohit",
            //     email: "mohit@gmail.com"
            // }
        ])
        var formview = new formView({ collection: appcolletion })
        app.form.show(formview)
        
        var searchview = new searchView({ collection: appcolletion })
        app.search.show(searchview)

        var userscolletionview = new usersColletionView({ collection: appcolletion })
        app.list.show(userscolletionview)
    })
})

app.start()