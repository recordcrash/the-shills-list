<template>
  <div class="d-flex flex-row ma-6 justify-center">
    <v-card flat class="justify-center">
        <v-card-title class="justify-center">What we're all about</v-card-title>
        <v-card-text style="hyphens: auto; word-break: break-all;">
          <p><h3>Welcome to the Shills List!</h3>
          <p>This is a list of all the best obscure and unappreciated works that you can reach from a computer. You won't get this anywhere else!</p>
          <p><h3>Custom Shill Conditions</h3>
          <ul>
            <li>Whomsoever finishes all the Main Shills and passes a test of knowledge shall get their own shill added to the Custom Shills.</li>
            <li>Such a <span class="glitch" data-text="successor">successor</span> can further expand their influence by reading every non-custom shill, earning themselves their own list on the sidebar.</li> 
            <li>As of the writing of this, Drew Linky and Kidpen have become successors, while seven people have managed to submit a custom shill.</li>
              </ul>
          <p><h3>More information</h3>
          <p>The Shills List is open source, and available at <a href="https://github.com/recordcrash/shills/" target="_blank">Github</a>. Pull requests are encouraged.</p>
          <p>For more information, feedback, or custom shill requests, join the <a href="https://discord.gg/aknu95AZWZ" target="_blank">Shills List discord channel</a>.</p>
        </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.glitch {
  color: white;
  position: relative;
  margin: 0 auto;
  hyphens: none;
  word-break: normal;
  opacity: 0.7;
}
@keyframes noise-anim {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      $topWithPercent: $top * 1%;
      $bottomWithPercent: $bottom * 1%;
      clip-path: inset(#{$topWithPercent} 0 #{$bottomWithPercent} 0);
    }
  }
}
.glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0px;
  text-shadow: 0px 0 red;
  top: -3px;
  color: white;
  background: #1e1e1e;
  overflow: hidden;
  animation: noise-anim 2s infinite linear alternate-reverse;
}

@keyframes noise-anim-2 {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      $topWithPercent: $top * 1%;
      $bottomWithPercent: $bottom * 1%;
      clip-path: inset(#{$topWithPercent} 0 #{$bottomWithPercent} 0);
    }
  }
}
.glitch::before {
  content: attr(data-text);
  position: absolute;
  left: 0px;
  text-shadow: 0px 0 blue;
  top: -1px;
  color: white;
  background: #1e1e1e;
  overflow: hidden;
  animation: noise-anim-2 15s infinite linear alternate-reverse;
}
</style>
