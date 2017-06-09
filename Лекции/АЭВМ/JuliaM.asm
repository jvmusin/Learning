;Посчитать разницу между количеством 1 и 0 битов
cseg segment
	assume cs:cseg
start:	
		number dw 0000000000000011b	;число в двоичном представлении (можно написать в десятичном, без b на конце)
		
		mov dx, 0		;количество единиц минус количество нулей
		mov si, 0		;номер проверяемого бита
		
	cycle:
		mov bx, 1
		and bx, number	;проверяем младший бит числа
		
		cmp bx, 0		;если мл. бит равен 0,
		je decrease		;то уменьшим счётчик на 1
		
		inc dx			;иначе увеличим на 1
		jmp next
	
	decrease:
		dec dx			;уменьшение счётчика на 1
	
	next:
		shr number, 1	;сдвигаем биты числа вправо
		inc si			;увеличиваем счётчик
		cmp si, 16		;если до конца ещё не дошли,
		jne cycle		;продолжаем цикл
		
		cmp dx, 0		;если число отрицательное,
		jge choose		;то возьмём его по модулю
		mov ax, dx		;воспользуемся формулой |x| = x - x - x
		sub dx, ax
		sub dx, ax
		
	choose:
		cmp dx, 10		;если число < 10,
		jl  print_one	;напечатаем 1 символ
		jmp print_two	;иначе напечатаем два символа
		
	print_one:			;печать однозначного числа
		mov ax, 0600h
		
		add dl, 48		;добавим код символа '0'
		int 21h
		
		jmp finish
	
	print_two:			;печать двухзначного числа
		mov ax, 0600h
		
		mov bx, dx		;запомним в bx наше число
		mov dx, 49		;выведем символ '1'
		int 21h
		mov dx, bx		;вернём число обратно в dx
		sub dx, 10		;вычтем десяток
		add dx, 48		;добавим код символа '0'
		int 21h
		
	finish:
		mov ax,4C00h
		int 21h
		
	cseg ends
end start