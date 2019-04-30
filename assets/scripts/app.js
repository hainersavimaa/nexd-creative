// Components:

// Creative header component
var creativesHeader = {
  template: `
            <header class="add-creative">
              <h3 class="add-creative__heading">My creatives</h3>
              <button class="btn add-creative__btn btn--main" @click="$emit('show-form')">Add</button>
            </header>
            `
};

// Creative filtering toggle component
var filterCreatives = {
  props: ['filtering'],
  template: `
            <div>
              <button class="btn sorting__btn" :class="{'btn--main': filtering == 'mobile' || !filtering}" @click="$emit('filter-mobile')">Mobile</button>
              <button class="btn sorting__btn" :class="{'btn--main': filtering == 'desktop' || !filtering}" @click="$emit('filter-desktop')">Desktop</button>
            </div>`
};

// Creative sorting component
var sortCreatives = {
  props: ['name'],
  template: `
              <button @click="$emit('sort-change', $event.target.value)">Sort {{name}}</button>
            `
};

// Creative form component
var creativesForm = {
  data() {
    return {
      newCreative: {
        name: this.creative.name,
        device: this.creative.device,
        width: this.creative.width,
        height: this.creative.height
      }
    }
  },
  methods: {
    sendData: function() {
      this.$emit('save-creative', this.newCreative);
    }
  },
  props: ['creative', 'editing', 'creating', 'formType'],
  template: `
            <form class="creative-form">
              <h3 class="creative-form__heading">{{formType.heading}}</h3>
              <div class="creative-form-row row">
                <div class="col col-sm-100 col-m-40">
                  <p class="creative-form-row__label">Creative name:</p>
                </div>
                <div class="col col-sm-100 col-m-60 pad-16">
                  <input type="text" placeholder="Write name here" v-model="newCreative.name">
                </div>
              </div>
              <div class="creative-form-row row">
                <div class="col col-sm-100 col-m-40">
                  <p class="creative-form-row__label">Device:</p>
                </div>
                <div class="col col-sm-100 col-m-60">
                  <div class="row">
                    <div class="col col-sm-100 col-m-50">
                      <label for="mobile" class="btn" :class="{'btn--main': newCreative.device == 'mobile'}">Mobile</label>
                      <input type="radio" id="mobile" class="hidden" value="mobile" v-model="newCreative.device">
                    </div>
                    <div class="col col-sm-100 col-m-50">
                      <label for="desktop" class="btn" :class="{'btn--main': newCreative.device == 'desktop'}">Desktop</label>
                      <input type="radio" id="desktop" class="hidden" value="desktop" v-model="newCreative.device">
                    </div>
                  </div>
                </div>
              </div>
              <div class="creative-form-row row">
                <div class="col col-sm-100 col-m-40">
                  <p class="creative-form-row__label">Placement size:</p>
                </div>
                <div class="col col-sm-100 col-m-60">
                  <div class="row">
                    <div class="col col-sm-100 col-m-50">
                      <input type="number" placeholder="Width" v-model="newCreative.width">
                    </div>
                    <div class="col col-sm-100 col-m-50">
                      <input type="number" placeholder="Height" v-model="newCreative.height">
                    </div>
                  </div>
                </div>
              </div>
              <div class="creative-form-submit row">
                <div class="col-100 align-right">
                  <button class="creative-form-submit__submit-btn btn btn--secondary" @click.prevent="$emit('cancel-creative')">Cancel</button>
                  <button class="creative-form-submit__submit-btn btn btn--main" @click.prevent="sendData" :disabled="!newCreative.name || !newCreative.device || !newCreative.width || !newCreative.height">{{formType.buttonName}}</button>
                </div>
              </div>
            </form>
            `
}

var creatives = new Vue({
  el: '#creatives',
  components: {
    'creatives-header': creativesHeader,
    'filter-creatives': filterCreatives,
    'sort-creatives': sortCreatives,
    'creatives-form': creativesForm
  },
  data: {
      creating: false,
      editing: false,
      editing_id: null,
      sorting: 'asc',
      filtering: null,
      formType: {},
      creatives: [],
      newCreative: {},
  },
  methods: {
    showForm: function(status, index) {
      // Check weather this form is used for editing an existing creative or creating a new one
      if(status === 'create') {
        this.formType.heading = 'New Creative';
        this.formType.buttonName = 'Create'
        this.creating = true;
        this.initializeNewCreative();
      } else if(status === 'edit') {
        // if editing, change the newCreative object and populate it with data from creatives array[index] position
        this.editing = true;
        this.editing_id = index;
        this.formType.heading = 'Edit Creative';
        this.formType.buttonName = 'Apply'
        this.newCreative = {
          name: this.creatives[index].name,
          device: this.creatives[index].device,
          width: this.creatives[index].width,
          height: this.creatives[index].height
        };
      }
    },
    closeForm: function() {
      // Function for closing the form.
      this.creating = false;
      this.editing = false;
      this.editing_id = null;
    },
    saveCreative: function(newCreativeObject) {
      // Check if editing. Editing: replace the element in the array with index. New: push new object to the creatives array
      this.newCreative = {
        name: newCreativeObject.name,
        device: newCreativeObject.device,
        width: newCreativeObject.width,
        height: newCreativeObject.height
      }
      // Check if the state is editing or creating. If editing: replace the object on correct position, creating: push it to the end of the array.
      if(this.editing) {
        this.creatives.splice(this.editing_id, 1, this.newCreative);
      } else {
        this.creatives.push(this.newCreative);
      }
      // Hide form & initialize newCreative object.
      this.closeForm();
      this.initializeNewCreative();
    },
    cancelCreative: function() {
      // Function that is called when cancelling creating or editing of a creative.
      this.closeForm();
      this.initializeNewCreative();
    },
    duplicateCreative: function(index) {
      // Duplicate creatives array object in the position [index]
      // Get the object from correct index. Had to use Object.assign, because var duplicatingItem = this.creatives[index] copying caused an error. Created object contained the same reference as the original array
      var duplicatingItem = Object.assign({}, this.creatives[index]);
      // Add 'Copy' to the end of the name of the creative after each duplication
      duplicatingItem.name += ' Copy'
      // Push the duplicate to creatives array
      this.creatives.push(duplicatingItem);
    },
    deleteCreative: function(index) {
      // Remove object from creatives array
      this.creatives.splice(index,1);
    },
    filterCreatives: function(device) {
      // Filtering function which is called upon clicking on mobile or desktop toggler.
      if(!this.filtering  || this.filtering !== device) {
        this.filtering = device;
      } else {
        this.filtering = null
      }
    },
    initializeNewCreative: function() {
      // Set default values to newCreative object
      this.newCreative = {
        name: '',
        device: '',
        width: '',
        height: ''
      };
    }
  },
  computed: {
    sortedCreatives: function () {
      var creatives = this.creatives; // So original data would stay intact and not changed
      // Check filtering and filter according to the this.filtering value
      if (this.filtering === 'mobile') {
        creatives = creatives.filter(creative => creative.device === 'mobile');
      } else if (this.filtering === 'desktop') {
        creatives = creatives.filter(creatives => creatives.device === 'desktop');
      }
      // Sort asc or desc. default value is asc
      return creatives.sort((a, b) => {
        if (this.sorting === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      })
    }
  },
  mounted: function() {
    // hide #creatives until Vue instance in mounted to avoid split-second flickering of unrendered DOM
    document.querySelector('.creatives-container').style.display = 'block'
  }
});
