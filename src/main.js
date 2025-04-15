import './style.css';
import './wuziqi.css';
import Wuziqi from './wuziqi.js';

const wuziqi = new Wuziqi('#app');

wuziqi.start();

const info = wuziqi.container.append('div').text('五子棋');

wuziqi.container.on('turnend', () => {
  info.text('轮到' + wuziqi.turn);
});

wuziqi.container.on('gameover', () => {
  info.text('' + wuziqi.result + '胜利');
});
