import { createModel } from './model.js';
import { createView } from './view.js';
import { createController } from './controller.js';
import { api } from './api.js';

function bootstrap() {
  const model = createModel();
  const view = createView(document);
  const controller = createController({ model, view, api });
  controller.start();
}

document.addEventListener('DOMContentLoaded', bootstrap);