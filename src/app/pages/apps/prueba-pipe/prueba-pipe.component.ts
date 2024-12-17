import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faVideo, faPhone, faEllipsisV, faUserCircle, faUsers, faPlus, faBan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-prueba-pipe',
  templateUrl: './prueba-pipe.component.html',
  styleUrls: ['./prueba-pipe.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class PruebaPipeComponent {
  messages: { from: string, text: string }[] = [];
  newMessage: string = '';
  isTyping: boolean = false;

  constructor(private http: HttpClient, library: FaIconLibrary) {
    library.addIcons(faPaperPlane, faPaperclip, faSearch, faVideo, faPhone, faEllipsisV, faUserCircle, faUsers, faPlus, faBan);
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ from: 'me', text: this.newMessage });
      this.isTyping = true;
      this.sendToBackend(this.newMessage);
      this.newMessage = '';
    }
  }

  sendToBackend(message: string) {
    const url = 'http://localhost/Pruebas%20Modals/agenteAPI.php';  // Cambia a la URL correcta si es necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `ind=29&pregunta=${encodeURIComponent(message)}&idcliente=300&audio_nom=no`;

    this.http.post(url, body, { headers }).subscribe((response: any) => {
      this.isTyping = false;
      if (response.status === 'ok') {
        this.messages.push({ from: 'other', text: response.robot_response });
      } else {
        this.messages.push({ from: 'other', text: 'Error: ' + response.message });
      }
    }, error => {
      this.isTyping = false;
      this.messages.push({ from: 'other', text: 'Error al conectar con el servidor.' });
    });
  }

  simulateTyping() {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      this.simulateResponse();
    }, 1000); // Simulate typing for 1 second
  }

  simulateResponse() {
    this.messages.push({ from: 'other', text: 'This is a simulated response' });
  }
}
