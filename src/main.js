import './style.css';
import './wuziqi.css';
import Wuziqi from './wuziqi.js';

const container = document.getElementById('app');

container.innerHTML = `
<h2>五子棋</h2>
<div id="config-panel">
  <label>
    行数:
    <input type="number" id="rows" value="11" min="5" />
  </label>
  <label>
    列数:
    <input type="number" id="cols" value="11" min="5" />
  </label>
  <button id="start-btn">开始游戏</button>
</div>
`

const info = document.createElement('div');
info.textContent = '点击开始游戏';
container.appendChild(info);

document.getElementById('start-btn').addEventListener('click', () => {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);

  const containerWidth = document.documentElement.clientWidth;
  const containerHeight = document.documentElement.clientHeight;
  const size = Math.min(containerWidth, containerHeight) * 0.8 - 100; // 90% 留点边距

  document.getElementById('config-panel').style.display = 'none';

  const game = new Wuziqi('#app', {
    rows,
    cols,
    width: size,
    height: size,
    radius: size / Math.max(rows, cols) / 3,
    padding: size / Math.max(rows, cols) / 3 * 2,
  });

  container.addEventListener('turnend', () => {
    info.textContent = ('轮到' + game.turn);
  });
  
  container.addEventListener('gameover', () => {
    info.textContent = ('' + game.result + '胜利');
  });
  
  game.start();

  console.log(game);
});



