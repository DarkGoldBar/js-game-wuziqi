import * as d3 from 'd3';

class Qizi {
  constructor(row, col, cx, cy, color = null) {
    this.row = row;
    this.col = col;
    this.cx = cx;
    this.cy = cy;
    this.color = color;
  }
}

class WuziqiConfig {
  constructor({
    rows = 11,
    cols = 11,
    width = 200,
    height = 200,
    radius = 6,
    padding = 12,
  } = {}) {
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.padding = padding;
  }
}

export default class Wuziqi {
  constructor(query, config = {}) {
    this.config = new WuziqiConfig(config);
    const { rows, cols, width, height, padding, radius } = this.config;

    this.container = d3.select(query);
    this.svg = this.container
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.turn = null;
    this.result = null;
    this.chessboard = [];

    const xScale = d3
      .scaleLinear()
      .domain([0, cols - 1])
      .range([padding, width - padding]);
    const yScale = d3
      .scaleLinear()
      .domain([0, rows - 1])
      .range([height - padding, padding]);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(cols)
      .tickSize(-height + 2 * padding)
      .tickFormat('');
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(rows)
      .tickSize(-width + 2 * padding)
      .tickFormat('');

    this.svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(xAxis)
      .call((g) => g.select('.domain').remove());

    this.svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis)
      .call((g) => g.select('.domain').remove());

    for (let row = 0; row < rows; row++) {
      const rowArray = [];
      for (let col = 0; col < cols; col++) {
        const cx = xScale(col);
        const cy = yScale(row);
        rowArray.push(new Qizi(row, col, cx, cy));
      }
      this.chessboard.push(rowArray);
    }

    this.svg
      .selectAll('circle')
      .data(this.chessboard.flat())
      .join('circle')
      .attr('class', 'qizi')
      .attr('cx', (d) => d.cx)
      .attr('cy', (d) => d.cy)
      .attr('r', radius)
      .attr('fill', 'transparent')
      .on('click', (event, d) => {
        if (!this.turn || d.color) return;
        d.color = this.turn;
        this.update();
        this.turn = this.turn === 'black' ? 'white' : 'black';
        this.result = this.checkWinner();
        if (this.result) {
          this.container.dispatch('gameover');
          this.svg.selectAll('circle').on('click', null);
        } else {
          this.container.dispatch('turnend');
        }
      });
  }

  start() {
    this.turn = 'black';
    this.result = null;
  }

  update() {
    this.svg
      .selectAll('circle')
      .attr('fill', (d) => d.color ?? 'transparent')
      .classed('placed', (d) => !!d.color);
  }

  checkWinner() {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];

    const { rows, cols } = this.config;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currentPiece = this.chessboard[row][col];
        if (currentPiece.color) {
          for (const { dr, dc } of directions) {
            let count = 1;

            for (let step = 1; step < 5; step++) {
              const newRow = row + dr * step;
              const newCol = col + dc * step;
              if (
                newRow < 0 ||
                newRow >= rows ||
                newCol < 0 ||
                newCol >= cols ||
                this.chessboard[newRow][newCol].color !== currentPiece.color
              )
                break;
              count++;
              if (count === 5) return currentPiece.color;
            }

            for (let step = 1; step < 5; step++) {
              const newRow = row - dr * step;
              const newCol = col - dc * step;
              if (
                newRow < 0 ||
                newRow >= rows ||
                newCol < 0 ||
                newCol >= cols ||
                this.chessboard[newRow][newCol].color !== currentPiece.color
              )
                break;
              count++;
              if (count === 5) return currentPiece.color;
            }
          }
        }
      }
    }

    return null;
  }
}
