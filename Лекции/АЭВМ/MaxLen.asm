;Распечатать все слова с нечётными номерами
dseg segment
	t	db	'pas bas c# cpp c# $'	;name db(define bytes) ...
	mes	db	'init str$'
	lf	db	13,10,'$'
dseg ends

cseg segment
	assume cs:cseg, ds:dseg
start:	mov ax,dseg
		mov ds,ax
		
		;вывод
		mov	ah,9
		lea	dx,mes
		int	21h
		
		lea	dx,lf
		int	21h
		
		lea	dx,t
		int	21h
		
		lea	dx,lf
		int	21h
		
		mov	dl,0	;результат = 0
		
		;bx и di свободные для индексации
		mov	si,0	;перемещение по строке t
		mov	di,0	;начало самой длинной
		mov bx,0	;длина максимальной
		mov dx,0	;длина текущей
		
	b0:	mov	byte ptr al,t[si]
		inc si
		
		;Выход если конец
		cmp al, '$'
		je	fin
		
		;Конец строки => обновление ответа, иначе длина++ и повтор
		cmp al, ' '
		je	b1
		add dx,1
		jmp	b0

		;Если лучше - обновляем
	b1:	cmp dx,bx
		jle	b0
		
		;Обновление ответа
		mov bx,dx
		mov di,si
		sub	di,dx
		mov dx,0
		jmp	b0
	
	fin:
		mov si,di
	f2:	mov	byte ptr al,t[si]
		inc si
		
		mov ah,6
		mov dl,al
		int 21h
		
		cmp al,' '
		jne	f2
		
		mov ax,4C00h
		int 21h
	cseg ends
end start