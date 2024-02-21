// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen
// by writing 'black' in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen by writing
// 'white' in every pixel;
// the screen should remain fully clear as long as no key is pressed.

@8191
D=A
@SCREEN
D=D+A
@end
M=D

(START)
@SCREEN
D=A
@i
M=D
@KBD
A=M
D=A

@BLACK
D;JNE
@color
M=0
@CHECK_PREVIOUS_COLOR
0;JMP
(BLACK)
@color
M=-1

(CHECK_PREVIOUS_COLOR)
@color
D=M
@previousColor
D=D-M
@START
D;JEQ
@color
D=M
@previousColor
M=D

(LOOP)
  @i
  D=M
  @end
  D=D-M
  @START
  D;JGT

  @color
  D=M
  @i
  A=M
  M=D

  @i
  M=M+1
  @LOOP
  0;JMP
