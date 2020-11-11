<template>
  <div class="vis-section">
    <div class="vis-section-header">
      {{ headerText }}
    </div>
    <div class="vis-section-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisSection',
  props: {
    headerText: {
      type: String,
      required: true
    }
  },
  setup(props) {
  }
};
</script>

<style scoped lang='scss'>
$theme-color: #369;

.vis-section {
  margin: 5px 25px;

  .vis-section-header {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: $theme-color;
    border: 1px solid $theme-color;
    color: #EEE;
  }
  .vis-section-content {
    padding: 5px;
    text-align: left;
    background: #FFF;
    border: 1px solid $theme-color;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
