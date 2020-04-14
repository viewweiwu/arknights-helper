let Main = {
  data() {
    return {
      date: new Date()
    };
  },
  computed: {
    datetime() {
      let { date } = this;
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minutes = date.getMinutes();
      return `${year}/${month}/${day} ${hour}:${minutes}`;
    }
  },
  mounted() {
    this.loopTime();
  },
  methods: {
    loopTime() {
      setTimeout(() => {
        this.date = new Date();
      }, 1000);
    },
    handleSideSelect(type) {
      switch (type) {
        case 'fight':
          this.$refs.grid.show();
          break;
        case 'preview':
          this.$refs.preview.show();
          break;
        case 'params':
          this.$refs.params.show();
          break;
      }
    },
    showSide() {
      this.$refs.side.show();
    }
  }
};

window.app = new window.Vue(Main).$mount('#app');
