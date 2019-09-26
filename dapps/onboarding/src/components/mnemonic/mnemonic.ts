/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

import {
  lightwallet
} from '@evan.network/ui-dapp-browser';

import {
  Component, OnInit, // @angular/core
  NavController,     // ionic-angular
  DomSanitizer,
  OnDestroy,
  ViewChild, ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  EvanCoreService,
  createGrowTransition,
  EvanInputService,
  EvanRoutingService,
  EvanQrCodeService
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'mnemonic-display',
  templateUrl: 'mnemonic.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MnemonicComponent implements OnInit {
  @Input() mnemonic: string;
  @Input() read: boolean;
  @Input() showInput: boolean;

  @ViewChild('mnemonichelp') $helpElement: ElementRef;

  private activeHelp: number;
  private activeWord: number;
  private activeWordElement: any;
  private deactivateHelpTimeout: any;
  private help: Array<string>;
  private mnemonicWords: Array<string>;
  private originalWords: Array<string>;
  private riddleCount: number;
  private riddleWords: Array<number>;
  private wordCount: number;
  private words: Array<string>;
  private isRiddle: boolean;
  private isPasting: boolean;
  private scrollToHelp: boolean;
  private lightwallet: any;
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() public onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    public _DomSanitizer: DomSanitizer,
    private core: EvanCoreService,
    private inputService: EvanInputService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private qrCodeService: EvanQrCodeService
  ) { }

  ngOnInit() {
    this.lightwallet = lightwallet;
    this.mnemonicWords = lightwallet.getMnemonicLib().Words.ENGLISH;
    this.wordCount = this.mnemonicWords.length;
    this.activeWord = -1;
    this.help = [ ];
    this.riddleCount = 6;

    const queryParams = this.routingService.getQueryparams();
    const riddleAdjust = window.localStorage['evan-mnemonic-riddle'] ||
      (queryParams ? queryParams['riddle-count'] : '');
    if (typeof riddleAdjust !== 'undefined') {
      try {
        this.riddleCount = parseInt(riddleAdjust, 10);
      } catch (ex) { }

      if (isNaN(this.riddleCount)) {
        this.riddleCount = 6;
      }

      if (this.riddleCount > 12) {
        this.riddleCount = 12;
      }

      if (this.riddleCount < 0) {
        this.riddleCount = 0;
      }
    }

    if (!this.read) {
      this.mnemonic = this.mnemonic || lightwallet.generateMnemonic();
      this.originalWords = this.mnemonic.split(' ');
      this.words = this.mnemonic.split(' ');

      this.riddleWords = [ ];
    } else {
      this.mnemonic = '';
      this.originalWords = [ ];
      this.words = [ ];
      this.riddleWords = [ ];

      for (let i = 0; i < 12; i++) {
        this.originalWords.push('');
        this.words.push('');
        this.riddleWords.push(i);
      }
    }

    this.ref.detectChanges();
    this.onChange.emit();
  }

  /**
   * Returns the current mnemonic concadinated of all words
   */
  getMnemonic() {
    if (this.showInput) {
      return this.mnemonic;
    } else {
      return this.words.slice(0, 12).join(' ');
    }
  }

  /**
   * Start the word riddle.
   * Removes some elements of the words entry and they should be inserted.
   */
  public startRiddle() {
    this.words = this.core.utils.deepCopy(this.originalWords);
    this.riddleWords = [ ];
    this.isRiddle = true;

    // dont allow clear input when we are within the riddle
    this.showInput = false;

    while (this.riddleWords.length < this.riddleCount) {
      const random = Math.round(Math.random() * 11);

      if (this.riddleWords.indexOf(random) === -1) {
        this.riddleWords.push(random);
      }
    }

    for (let i = 0; i < this.riddleWords.length; i++) {
      this.words[this.riddleWords[i]] = '';
    }

    this.ref.detectChanges();
    this.onChange.emit();
  }

  // restore mnemonic
  public cancelRiddle() {
    this.riddleWords = [ ];
    this.words = this.core.utils.deepCopy(this.originalWords);
    this.isRiddle = false;

    this.ref.detectChanges();
    this.onChange.emit();
  }

  // check if the current mnemonic is valid
  // If read mode is enabled, check for all words alone
  public isValid() {
    if (this.read) {
      return lightwallet.isValidMnemonic(this.getMnemonic());
    } else {
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i] !== this.originalWords[i]) {
          return false;
        }
      }

      return true;
    }
  }

  public wordsAreFilled() {
    for (let i = 0; i < this.words.length; i++) {
      if (!lightwallet.isValidMnemonicWord(this.words[i])) {
        return false;
      }
    }

    return true;
  }

  // Filter all possible mneonic words for the current value.
  getFilteredWords(value = '') {
    const filteredWords = [ ];

    if (this.activeWord !== -1 && value !== '') {
      for (let i = 0; i < this.wordCount; i++) {
        if (this.mnemonicWords[i].indexOf(value) === 0) {
          filteredWords.push(this.mnemonicWords[i]);
        }

        if (filteredWords.length === 10) {
          break;
        }
      }
    }

    return filteredWords;
  }

  // Handles filter help.
  //   - set help words
  //   - update the word if enter or tab is pressed
  //   - navigates through the breadcrumb suggestions
  async filterHelp(value = '', $event?: any) {
    // set value of nmneonic word if tab or enter is pressed set the first word
    if ($event) {
      switch ($event.keyCode) {
        // tab
        case 9 :
        // enter
        case 13: {
          // set suggestion value to the word
          if (this.help.length > this.activeHelp && value) {
            this.words[this.activeWord] = this.help[this.activeHelp];
          }

          // simulate tab when active word is filled
          if ($event.keyCode === 13) {
            const activeElement = document.activeElement;
            const inputs = document.querySelectorAll('input');

            for (let i = 0; i < (inputs.length - 1); i++) {
              if (inputs[i] === activeElement) {
                inputs[i + 1].focus();

                break;
              }
            }
          }

          break;
        }

        // navigate to the left breadcrumb
        case 37: {
          this.activeHelp--;

          if (this.activeHelp < 0) {
            this.activeHelp = 0;
          }

          this.focusHelpElement();

          $event.preventDefault()
          $event.stopPropagation();
          this.ref.detectChanges();
          return false;
        }

        // navigate to the right breadcrumb
        case 39: {
          this.activeHelp++;

          if (this.activeHelp > this.help.length - 1) {
            this.activeHelp = this.help.length - 1;
          }

          this.focusHelpElement();

          $event.preventDefault()
          $event.stopPropagation();
          this.ref.detectChanges();
          return false;
        }
        // when backspace is pressed, reduce the current value and search with it
        // !only need because we bind keypress down event to break left / right navigation in input
        case 8: {
          if (value.length > 0) {
            value = value.slice(0, value.length - 1);
          }

          this.help = this.getFilteredWords(value.toLowerCase());

          break;
        }

        // press enter
        case 17: {
          this.isPasting = true;

          break;
        }
        // when any button is pressed, add the value and search with it
        // !only need because we bind keypress down event to break left / right navigation in input
        default: {
          this.activeHelp = 0;

          if (this.isPasting && $event.key === 'v') {
            setTimeout(() => {
              this.filterHelp(this.words[this.activeWord]);
            });
          } else if ($event.key && $event.key.length === 1) {
            value += $event.key;
          }

          this.help = this.getFilteredWords(value.toLowerCase());
        }
      }

      if ($event.keyCode !== 17) {
        this.isPasting = false;
      }
    } else {
      this.help = this.getFilteredWords(value.toLowerCase());

      this.activeHelp = 0;
    }

    if (this.scrollToHelp && this.help.length > 0) {
      this.scrollToHelp = false;
      this.ref.detectChanges();

      await this.core.utils.timeout(100);

      this.inputService.scrollToActiveInput();
    }

    this.ref.detectChanges();
    this.onChange.emit();
  }

  /**
   * Checks if the current suggestion is out of scroll container and animates to this scroll position.
   */
  focusHelpElement() {
    const $container = this.$helpElement.nativeElement;
    const $activeChild = $container.children[this.activeHelp];

    if ($activeChild) {
      const containerWidth = $container.offsetWidth;
      const childOffset = $activeChild.offsetLeft;
      const childWidth = $activeChild.offsetWidth;

      let scrollTo = childWidth + childOffset - containerWidth + 20;

      if (scrollTo < 0) {
        scrollTo = 0;
      } else if (scrollTo > childWidth + childOffset) {
        scrollTo = childWidth + childOffset;
      }

      this.core.utils.scrollTo($container, 'horizontal', scrollTo);
    }
  }

  /**
   * Use an suggested word and overwrite the mnemonic word
   * @param helpWord   word to update mnemonic word
   */
  setHelpWord(helpWord) {
    window.clearTimeout(this.deactivateHelpTimeout);

    this.words[this.activeWord] = helpWord;

    this.activeWordElement.focus();

    this.filterHelp(this.words[this.activeWord], { keyCode: 13 });

    this.ref.detectChanges();
    this.onChange.emit();
  }

  /**
   * Activate show help.
   * @param $event  focus event
   * @param index   index of word input that is activated
   */
  activateHelp($event, index) {
    window.clearTimeout(this.deactivateHelpTimeout);

    this.activeWordElement = $event.target;
    this.activeWord = index;
    this.scrollToHelp = true;

    this.filterHelp(this.words[index]);
  }

  /**
   * Disable suggestions
   * @param  $event  focusout event
   */
  deactivateHelp($event) {
    const target = $event.target;

    this.deactivateHelpTimeout = setTimeout(() => {
      this.activeWord = -1;
    }, 100);
  }

  /**
   * Check for an event number.
   * @param n number
   */
  isEven(n: number) {
    return n % 2 === 0;
  }

  getMnemonicHelpOrder() {
    return this.isEven(this.activeWord) ? (this.activeWord * 2) + 3 : (this.activeWord * 2) + 1;
  }

  toggleInput() {
    if (!this.isRiddle) {
      if (this.showInput) {
        this.mnemonic = this.words.join(' ')
          .trim()
          .replace(/\s\s+/g, ' ');
        
        setTimeout(() => {
          const mnemonicInput:any = document.querySelector('mnemonic-display textarea');

          mnemonicInput.focus();
        });
      } else {
        this.words = this.mnemonic.split(' ').slice(0, 12);

        if (this.words.length < 12) {
          for (let i = this.words.length - 1; i < 12; i++) {
            this.words.push('');
          }
        }
      }
    }

    this.ref.detectChanges();
    this.onChange.emit();
  }

  submitMnemonicDirectInput($event) {
    setTimeout(() => this.onChange.emit());

    if ($event.keyCode === 13) {
      this.onSubmit.emit();

      $event.preventDefault()
      $event.stopPropagation();
      return false;
    }
  }

  async scanQRCode() {
    try {
      const value = await this.qrCodeService.scanQRCode();

      this.mnemonic = value;

      this.ref.detectChanges();
      this.onChange.emit();
    } catch (ex) { }
  }}
