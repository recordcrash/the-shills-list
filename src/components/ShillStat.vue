<template>
    <section class="framework mr-5" :class="slugClass" v-if="data">
    <header class="framework__header">
      <strong class="framework__name">{{name}}</strong>
    </header>
    <div class="framework__data">
      <div class="framework__data-info">
        <div class="framework__period">
          <v-icon>mdi-flag</v-icon>
          <span class="framework__period-text">{{info.label}}</span>
        </div>
        <strong class="framework__downloads">{{info.value}}</strong>
      </div>
      <trend-chart :datasets="[dataset]" :min="0" padding="5 5 0" :interactive="true" @mouse-move="onMouseMove"></trend-chart>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ShillStat',
  props: {
    data: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentInfo: null,
    };
  },
  computed: {
    name() {
      if (this.slug.length > 35) {
        return `${this.slug[0].toUpperCase() + this.slug.slice(1, 35)}...`;
      }
      return `${this.slug[0].toUpperCase() + this.slug.slice(1, 35)}`;
    },
    weeklyReads() {
      return this.numberWithSpaces(this.data.reduce((a, c) => a + c.value, 0));
    },
    dataset() {
      return {
        data: this.data,
        showPoints: true,
        fill: true,
        className: this.className,
      };
    },
    slugClass() {
      return this.numberToOrdinal(this.index);
    },
    className() {
      return `curve-${this.numberToOrdinal(this.index)}`;
    },
    info() {
      return {
        label: this.currentInfo ? this.currentInfo.label : 'weekly completions',
        value: this.currentInfo ? this.currentInfo.value : this.weeklyReads,
      };
    },
  },
  methods: {
    numberToOrdinal(n) {
      switch (n) {
        case 1:
          return 'first';
        case 2:
          return 'second';
        case 3:
          return 'third';
        case 4:
          return 'fourth';
        case 5:
          return 'fifth';
        case 6:
          return 'sixth';
        default:
          return 'first';
      }
    },
    numberWithSpaces(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    onMouseMove(params) {
      if (!params) {
        this.currentInfo = null;
        return;
      }
      this.currentInfo = {
        label: params.data[0].day,
        value: this.numberWithSpaces(params.data[0].value),
      };
    },
  },
};
</script>

<style lang="scss">
.framework {
  flex-basis: 30%;
  min-width: 305px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__period {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    opacity: 0.5;
    &-icon {
      display: block;
      height: 10px;
      width: auto;
      margin-right: 5px;
    }
    &-text {
      font-size: 11px;
      line-height: 16px;
      white-space: nowrap;
    }
  }
  &__data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  &__downloads {
    font-size: 24px;
  }
  &.first {
    border-bottom: 2px solid rgba(#39af77, 0.2);
  }
  &.second {
    border-bottom: 2px solid rgba(#61dafb, 0.2);
  }
  &.third {
    border-bottom: 2px solid rgba(#d8002b, 0.2);
  }
  &.fourth {
    border-bottom: 2px solid rgba(#febc6b, 0.2);
  }
  &.fifth {
    border-bottom: 2px solid rgba(#259dff, 0.2);
  }
  &.sixth {
    border-bottom: 2px solid rgba(#9e689e, 0.2);
  }
}
.curve-first {
  .stroke {
    stroke: #97d1b6;
  }
  .fill {
    fill: #39af77;
  }
  .point {
    fill: #39af77;
    stroke: #39af77;
  }
}
.curve-second {
  .stroke {
    stroke: #61dafb;
  }
  .fill {
    fill: #61dafb;
  }
  .point {
    fill: #61dafb;
    stroke: #61dafb;
  }
}
.curve-third {
  .stroke {
    stroke: #d8002b;
  }
  .fill {
    fill: #d8002b;
  }
  .point {
    fill: #d8002b;
    stroke: #d8002b;
  }
}
.curve-fourth {
  .stroke {
    stroke: #febc6b;
  }
  .fill {
    fill: #febc6b;
  }
  .point {
    fill: #febc6b;
    stroke: #febc6b;
  }
}
.curve-fifth {
  .stroke {
    stroke: #259dff;
  }
  .fill {
    fill: #259dff;
  }
  .point {
    fill: #259dff;
    stroke: #259dff;
  }
}
.curve-sixth {
  .stroke {
    stroke: #b977b9;
  }
  .fill {
    fill: #9e689e;
  }
  .point {
    fill: #9e689e;
    stroke: #9e689e;
  }
}

</style>
