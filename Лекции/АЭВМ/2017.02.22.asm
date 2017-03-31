;Задана строка слов, разделённых одним пробелом, последним  словом фвл доллар
;Дано дополнительное слово a
;подсчитать, сколько раз встречается слово a (не больше 9)

dseg segment
	t	db	'pas bas c# cpp c# $'	;name db(define bytes) ...
	a	db	'c# '
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
		;
		lea	dx,lf
		int	21h
		;
		lea	dx,t
		int	21h
		;
		lea	dx,lf
		int	21h
		;
		mov	dl,0
		mov	si,0	;перемещение по строке t
		;bx и di
	beg:mov	di,0	;перемещение по строке a
		
	b0:	mov	byte ptr al,t[si]
		inc si
		cmp	al,a[di]
		jne	b2						;уйти если не совпало
		cmp al,' '
		je	b1
		inc di
		jmp b0
	b1:		;нашли совпадающее слово
		inc dl
	b11:cmp t[si],'$'
		je	fin
		jmp	beg
	b2:		;слова не совпали
		cmp	al,' '
		je	b11
		inc si
		mov al,t[si]
		jmp b2
	fin:or	dl,48
		mov ah,6
		int 21h
		
		mov ax,4C00h
cseg ends
	end start
	
;Задана строка символов из строк, разделённых одним пробелом
;Распечатать все слова с нечётными номерами
;Распечатать слово максимальной длины. Если слов несколько, взять первое