import React from "react";


export default class Container extends React.Component {
    componentDidMount() {
        var Space = {
            init: function(){
              var self = this;
              this.config = {
                perspective: 3,
                star_color: '255, 255, 255',
                speed: 1,
                stars_count: 2
              };
              this.canvas = document.getElementById('canvas');
              this.context = this.canvas.getContext('2d');
              this.start();
              window.onresize = function(){
                self.start();
              };
            },

            start: function(){
              var self = this;

              this.canvas.width  = this.canvas.offsetWidth;
              this.canvas.height = this.canvas.offsetHeight;
              this.canvas_center_x = this.canvas.width / 2;
              this.canvas_center_y = this.canvas.height / 2;

              this.stars_count = this.canvas.width / this.config.stars_count;
              this.focal_length = this.canvas.width / this.config.perspective;
              this.speed = this.config.speed * this.canvas.width / 2000;

              this.stars = [];

              for(let i = 0; i < this.stars_count; i++){
                this.stars.push({
                  x: Math.random() * this.canvas.width,
                  y: Math.random() * this.canvas.height,
                  z: Math.random() * this.canvas.width,
                });
              }

              window.cancelAnimationFrame(this.animation_frame);
              this.canvas.style.opacity = 1;

              this.cow = new Image();
              this.cow.src = 'https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Hamburger_PNG_Vector_Picture.png?m=1507172108';
              this.cow.onload = function(){
                self.render();
              }
            },

            render: function(){
              var self = this;
              this.animation_frame = window.requestAnimationFrame(function(){
                self.render();
              });
              this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
              for(var i = 0, length = this.stars.length; i < length; i += 1){
                var star = this.stars[i];
                star.z -= this.speed;
                if(star.z <= 0) {
                  this.stars[i] = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    z: this.canvas.width,
                  };
                }

                var star_x = (star.x - this.canvas_center_x) * (this.focal_length / star.z) + this.canvas_center_x;
                var star_y = (star.y - this.canvas_center_y) * (this.focal_length / star.z) + this.canvas_center_y;
                var star_radius  = Math.max(0, 1.4 * (this.focal_length / star.z) / 2);
                var star_opacity = 1.2 - star.z / this.canvas.width;
                var cow_width = Math.max(0.1, 100 * (this.focal_length / star.z) / 2);

                if(star.cow){
                  this.context.save();
                  this.context.translate((star_x-cow_width)+(cow_width/2), (star_y-cow_width)+(cow_width/2));
                  this.context.rotate(star.z/star.rotation_speed);
                  this.context.translate(-((star_x-cow_width)+(cow_width/2)), -((star_y-cow_width)+(cow_width/2)));
                  this.context.globalAlpha = star_opacity;
                  this.context.drawImage(this.cow, 0, 0, this.cow.width, this.cow.width, star_x-cow_width, star_y-cow_width, cow_width, cow_width);
                  this.context.restore();
                } else {
                  this.context.fillStyle = 'rgba(' + this.config.star_color + ',' + star_opacity + ')';
                  this.context.beginPath();
                  this.context.arc(star_x, star_y, star_radius, 0, Math.PI * 2);
                  this.context.fill();
                }
              }
            }
          };

          Space.init();
    }

    render() {
        return (
            <div>
                {this.props.children}
                <canvas id="canvas"></canvas>
            </div>
        )
    }
}
