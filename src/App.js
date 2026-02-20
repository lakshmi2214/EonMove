import express from 'express';
import { join } from 'path';
import homeRouter from './Home.js';
import aboutRouter from './About.js';
import servicesRouter from './Services.js';
import blogsRouter from './Blogs.js';
import contactRouter from './Contact.js';

const app = express();
const __dirname = process.cwd();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Middleware
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', homeRouter);
app.use('/about', aboutRouter);
app.use('/services', servicesRouter);
app.use('/blogs', blogsRouter);
app.use('/contact', contactRouter);

export default app;
