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
		mov	si,0	;перемещение по строке t
		
		;bx и di свободные для индексации
		mov	di,0	;перемещение по строке a через di
		
	b0:	mov	byte ptr al,t[si]
		inc si
		
		cmp al, '$'
		je	fin
		cmp al, ' '
		
		je	b1
		jmp	b0
		
	b1:	mov	byte ptr al,t[si]
		inc si
		
		cmp al,'$'
		je fin
		
		mov ah,6
		mov dl,al
		int	21h
		
		cmp al, ' '
		je	b0
		jmp b1
		
	fin:mov ax,4C00h
		int 21h
	cseg ends
end start