;вывод строки
mov	ah,9
lea	dx,mes
int	21h

;вывод символа
or	dl,48
mov ah,6
int 21h

jle; jump less or equal
