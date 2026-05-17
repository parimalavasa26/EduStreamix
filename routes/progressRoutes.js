const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dataFilePath = path.join(__dirname, '../data/progress.json');

// Helper to get git log
function getGitLog() {
  return new Promise((resolve) => {
    exec('git log -n 10 --pretty=format:"%h|%s|%ad" --date=short', { cwd: path.join(__dirname, '..') }, (error, stdout) => {
      if (error) {
        return resolve([]); // Return empty if git is not initialized or fails
      }
      const commits = stdout.split('\n').filter(Boolean).map(line => {
        const [hash, message, date] = line.split('|');
        return { hash, message, date };
      });
      resolve(commits);
    });
  });
}

// Public Progress Dashboard
router.get('/progress', async (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    const progressData = JSON.parse(rawData);
    const recentActivity = await getGitLog();
    
    res.render('progress', { ...progressData, recentActivity });
  } catch (err) {
    console.error('Error reading progress data:', err);
    res.status(500).send('Error loading progress data');
  }
});

// Admin Panel for Progress
router.get('/admin/progress', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    const progressData = JSON.parse(rawData);
    res.render('progress-admin', progressData);
  } catch (err) {
    console.error('Error reading progress data:', err);
    res.status(500).send('Error loading admin panel');
  }
});

// Update Progress Data
router.post('/admin/progress', (req, res) => {
  try {
    const {
      title, objective, technologies, stage,
      completedModules, underDevelopment, pendingTasks
    } = req.body;

    // Helper to parse comma separated or newline separated strings to arrays
    const parseList = (str) => {
      if (!str) return [];
      if (Array.isArray(str)) return str;
      return str.split('\n').map(s => s.trim().replace(/^- /, '')).filter(Boolean);
    };

    const newProgress = {
      title: title || '',
      objective: objective || '',
      technologies: technologies || '',
      stage: stage || '',
      completedModules: parseList(completedModules),
      underDevelopment: parseList(underDevelopment),
      pendingTasks: parseList(pendingTasks)
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(newProgress, null, 2));
    res.redirect('/progress');
  } catch (err) {
    console.error('Error saving progress data:', err);
    res.status(500).send('Error saving progress data');
  }
});

module.exports = router;
