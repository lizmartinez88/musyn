/* eslint-disable no-console */
class ScoreController {
  constructor(container, scoreModel, cursors, scoreView) {
    this.startX = 60;
    this.beatSpacing = 50;
    this.pitchSpacing = 5;
    this.container = container;
    this.scoreModel = scoreModel;
    this.cursors = cursors;
    this.scoreView = scoreView;
    [this.svgContext] = container.children;

    this.noteMap = {
      29: 'G3',
      28: 'A3',
      27: 'B3',
      26: 'C4',
      25: 'D4',
      24: 'E4',
      23: 'F4',
      22: 'G4',
      21: 'A4',
      20: 'B4',
      19: 'C5',
      18: 'D5',
      17: 'E5',
      16: 'F5',
    };

    this.blur();
  }

  move(e) {
    const oldPos = this.mousePos;
    this.updatePos(e);

    if (this.mousePos === oldPos) return;

    if (this.mousePos === null) {
      this.cursors.remove('local');
      return;
    }

    const { x, y } = this.mousePos;
    const notename = this.noteMap[y];

    if (notename !== undefined) {
      this.cursors.update('local', notename, x);
    } else {
      this.cursors.remove('local');
    }

    this.scoreView.rerender();
  }

  blur() {
    this.mousePos = null;
    this.scoreView.rerender();
  }

  click(e) {
    this.updatePos(e);

    const { x, y } = this.mousePos;
    const notename = this.noteMap[y];

    if (notename !== undefined) {
      this.cursors.remove('local');
      this.scoreModel.addNote(this.noteMap[y], x);
      this.scoreView.rerender();
    }
  }

  updatePos(e) {
    const matrix = this.svgContext.getScreenCTM();
    let p = this.svgContext.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    p = p.matrixTransform(matrix.inverse());
    const point = {
      x: Math.floor((p.x - this.startX) / this.beatSpacing),
      y: Math.round(p.y / this.pitchSpacing),
    };

    if (point.x >= 0) {
      this.mousePos = point;
    } else {
      this.blur();
    }
  }
}

export default ScoreController;