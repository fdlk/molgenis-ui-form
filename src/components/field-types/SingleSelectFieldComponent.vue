<template>
  <!-- Tiny debounce to make sure that validation will always flip the fieldState.$pending flag -->
  <validate :state="fieldState" :custom="{'validate': isValid}" :debounce="1">
    <div class="form-group">
      <label :for="field.id">{{ field.label }}</label>

      <div class="input-group">

        <v-select v-model="localValue"
                  class="form-control"
                  :class="{ 'is-invalid' : fieldState && (fieldState.$touched || fieldState.$submitted || fieldState.$dirty) && fieldState.$invalid}"
                  :options="options"
                  :onSearch="fetchOptions"
                  :filterable="false"
                  :inputId="field.id"
                  :name="field.id"
                  :required="isRequired">

          <div slot="no-options">
            <small>{{ noOptionsMessage }}</small>
          </div>
        </v-select>

        <div v-if="allowAddingOptions && isAddOptionAllowed">
          <button @click="addOptionClicked($event)" class="btn btn-outline-secondary mg-select-add-btn" type="button">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <description :id="field.id" :text="field.description" />

      <form-field-messages :field-id="field.id" :field-state="fieldState">
      </form-field-messages>

    </div>
  </validate>
</template>

<script>
import VueForm from 'vue-form'
import vSelect from 'vue-select'
import FormFieldMessages from '../FormFieldMessages'
import Description from '../Description'
import { FormField } from '../../flow.types'

export default {
  name: 'SingleSelectFieldComponent',
  mixins: [VueForm],
  props: {
    value: {
      // ID of select field can be of type: Integer, Long, String etc.
      type: [String, Number],
      required: false
    },
    field: {
      type: FormField,
      required: true
    },
    fieldState: {
      type: Object,
      required: false
    },
    isValid: {
      type: Boolean,
      default: true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    eventBus: {
      type: Object,
      required: true
    },
    allowAddingOptions: {
      type: Boolean,
      required: false,
      default: false
    },
    noOptionsMessage: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      // Store a local value to prevent changing the parent state
      localValue: this.value,
      options: [],
      isAddOptionAllowed: true // init as true to allow for backward compatibility
    }
  },
  methods: {
    fetchOptions (search, loading) {
      loading(true)
      this.field.options(search).then(response => {
        this.options = response
        loading(false)
      })
    },
    addOptionClicked (event) {
      this.eventBus.$emit('addOption', this.afterOptionCreation, event, this.field)
    },
    afterOptionCreation (newOption) {
      this.options.push(newOption)
      this.localValue = newOption
    }
  },
  watch: {
    localValue (value) {
      this.fieldState.$dirty = true
      this.fieldState.$pristine = false
      this.fieldState.$touched = true
      this.fieldState.$untouched = false
      // Emit value changes to the parent (form)
      this.$emit('input', value ? value.id : null)
      this.$emit('focus')
      this.$emit('blur')
    }
  },
  created () {
    // Fetch an initial list of options
    this.field.options(this.value).then(response => {
      this.options = response
      if (this.value) {
        // Replace localValue with the entire object so vue-select can use the label property
        this.localValue = this.options.find(option => option.id === this.value)
      }
    })

    if (this.field.isAddOptionAllowed) {
      this.field.isAddOptionAllowed(this.value).then(response => {
        this.isAddOptionAllowed = response
      })
    }
  },
  components: {
    vSelect,
    FormFieldMessages,
    Description
  }
}
</script>
