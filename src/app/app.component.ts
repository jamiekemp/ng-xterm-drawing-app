import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { TerminalService } from './services/terminal.service';
import { DrawService } from './services/draw.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  drawCommands = {
    c: 'newCanvas',
    l: 'newLine',
    r: 'newRect',
    b: 'floodFill',
  };

  appCommands = {
    q: 'quitProgram',
    h: 'helpProgram'
  };

  commandKeys = Object.keys(this.drawCommands).join(' ').toUpperCase();

  @ViewChild('term', { static: true }) ngTerminal: NgTerminal;

  constructor(
    public terminalService: TerminalService,
    public drawService: DrawService) {}

  ngAfterViewInit(): void {
    this.initApplication();
  }

  initApplication(): void {
    this.terminalService.terminal = this.ngTerminal;
    this.initTerminalText();
    this.initTerminalSubscribe();

    // Dev Helper - Uncomment to run some commands on launch :)
    // BUT Must remain commented for tests to run !!!
    // this.newCommand('C 20 4');
    // this.newCommand('L 1 2 6 2');
    // this.newCommand('L 6 3 6 4');
    // this.newCommand('R 14 1 18 3');
    // this.newCommand('B 10 3 o');
  }

  initTerminalText(): void {
    this.terminalService.resetApp();
  }

  initTerminalSubscribe(): void {
    this.terminalService.terminal.keyEventInput.subscribe(e => {
      this.handleInput(e);
    });
  }

  handleInput(e): void {
    const terminalService = this.terminalService;
    const ev = e.domEvent;
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

    if (ev.which === 13 || ev.keyCode === 13 || e.key === 'Enter') {
      this.newCommand(terminalService.command);
      terminalService.resetCommand();
    } else if (ev.which === 8 || ev.keyCode === 8 || e.key === 'Backspace') {
      // Do not delete the prompt
      if (terminalService.cursorX > 1) {
        terminalService.write('\b \b');
        terminalService.backspaceCommand();
      }
    } else if (printable) {
      terminalService.write(e.key);
      terminalService.command += e.key;
    }
  }

  newCommand(command: string): void {
    const params = this.getCommandParams(command);
    const commandKey = command.charAt(0).toLowerCase();
    const drawService = this.drawService;
    const terminalService = this.terminalService;

    if (this.drawCommands[commandKey]) { return drawService[this.drawCommands[commandKey]](params); }
    if (this.appCommands[commandKey])  { return terminalService[this.appCommands[commandKey]](params); }

    // Reached here, so haven't found the command :(
    terminalService.invalidCommand(`Invalid Command :( Your command must begin with one of the following letters: ${this.commandKeys}`);
  }

  getCommandParams(command: string): Array<number|string> {
    const split = command.split(' ');
    const [ignore, ...paramStrings] = split;
    // convert to a number if possible :)
    return paramStrings.map(param => +param || param);
  }

}
