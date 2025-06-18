import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DownloadService } from './../../services/download.service';

interface Step {
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  icon?: string;
}

@Component({
  selector: 'app-generate-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generate-project.component.html',
  styleUrls: ['./generate-project.component.css']
})
export class GenerateProjectComponent implements OnInit {
  progress = 0;
  currentStep = 0;
  downloadUrl: string | null = null;
  downloadReady: boolean = false;
  polling: boolean = false;
  showDownloadButton: boolean = false;
  countdown: number = 90;

  steps: Step[] = [
    { title: ' Initializing Project ', status: 'pending' },
    { title: 'Connecting to your Database', status: 'in-progress' },
    { title: 'Configuring  Services', status: 'pending' },
    { title: 'Creating API Endpoints ', status: 'pending' },
    { title: 'Configuring the server', status: 'pending' },
    { title: 'Setting up Frontend Components', status: 'pending' },
    { title: 'Building interfaces', status: 'pending' },
    { title: 'creating the Service', status: 'pending' },
    { title: 'Finalizing Project ', status: 'pending' }
  ];

  features = {
    frontend: {
      title: 'Frontend Features',
      icon: '⚡',
      items: [
        'Components & Pages',
        'Routing Configuration',
        'API Integration'
      ]
    },
    backend: {
      title: 'Backend Features',
      icon: '⚡',
      items: [
        'Connecting to the database',
        'API Endpoints'
      ]
    },
    database: {
      title: 'Database Features',
      icon: '⚡',
      items: [
        'MySQL Support',
        'Mongo Support',
      ]
    }
  };

  constructor(
    private DownloadService: DownloadService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.startGeneration();

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { uniqueId?: string, token?: string };

    if (state && typeof state.uniqueId === 'string' && typeof state.token === 'string') {
      const expiresAt = Date.now() + 30 * 60 * 1000;
      if (isBrowser()) {
        localStorage.setItem('uniqueId', state.uniqueId);
        localStorage.setItem('token', state.token);
        localStorage.setItem('expiresAt', expiresAt.toString());
      }
      this.pollForZip(state.uniqueId, state.token);
    } else {
      const savedId = isBrowser() ? localStorage.getItem('uniqueId') : null;
      const savedToken = isBrowser() ? localStorage.getItem('token') : null;
      const expiresAt = isBrowser() ? parseInt(localStorage.getItem('expiresAt') || '0', 10) : 0;

      if (typeof savedId === 'string' && typeof savedToken === 'string' && Date.now() < expiresAt) {
        this.pollForZip(savedId, savedToken);
      } else if (isBrowser()) {
        localStorage.removeItem('uniqueId');
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        console.warn('Lien expiré ou informations manquantes');
      }
    }
  }

  private startGeneration() {
    let step = 0;
    const interval = setInterval(() => {
      if (step < this.steps.length) {
        if (step > 0) {
          this.steps[step - 1].status = 'completed';
        }
        this.steps[step].status = 'in-progress';
        this.progress = Math.round((step / (this.steps.length - 1)) * 100);
        step++;
      } else {
        this.steps[step - 1].status = 'completed';
        this.progress = 100;
        clearInterval(interval);
      }
    }, 2000);
  }

  downloadProject() {
    const savedId = localStorage.getItem('uniqueId');
    const savedToken = localStorage.getItem('token');
    const expiresAt = parseInt(localStorage.getItem('expiresAt') || '0', 10);

    if (savedId && savedToken && Date.now() < expiresAt) {
      this.DownloadService.downloadFile(savedId, savedToken);
    } else {
      console.error("Lien expiré ou données manquantes.");
    }
  }

  private startCountdown() {
    const timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  private pollForZip(uniqueId: string, token: string) {
    this.polling = true;
    const url = `http://localhost:5000/zip-download/${uniqueId}/${token}`;
    this.downloadUrl = url;

    setTimeout(() => {
      this.showDownloadButton = true;
    }, 80000);

    const check = () => {
      this.http.head(url, { observe: 'response' }).subscribe({
        next: (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.downloadReady = true;
            this.polling = false;
          } else {
            setTimeout(check, 5000);
          }
        },
        error: () => setTimeout(check, 5000)
      });
    };
    check();
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}
