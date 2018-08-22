import {Observable, fromEvent, from, of, merge} from 'rxjs'
import {filter, map, startWith, withLatestFrom, tap} from 'rxjs/operators'
import $ from 'jquery'

export const sendButtonClick$ = fromEvent($('.send-btn'),'click');

const enterKeyPress$ = fromEvent($('.message-input'), 'keyup').pipe(
    filter(e => e.keyCode === 13 || e.which === 13)
);

const sendMessage$ = merge(sendButtonClick$, enterKeyPress$).pipe(
    map(() => $('.message-input').val()),
    filter(message => message),
    tap(() => $('.message-input').val(''))
);

const userSelectChange$ = fromEvent($('.user-select'), 'change').pipe(
    map(e => e.target.value),
    startWith('everyone')
);

const submitAction$ = sendMessage$.pipe(
    withLatestFrom(userSelectChange$),
    map(([message, socketId]) => ({message, socketId}))
);

export default submitAction$;
