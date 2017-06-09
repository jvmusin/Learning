;That's hot to print a string 't'
		mov si, 0
	print:
		mov	byte ptr al,t[si]
		
		mov ah,6
		mov dl,al
		int 21h
		
		inc si
		cmp t[si], '*'
		jne print