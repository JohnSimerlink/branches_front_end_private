# Contribution Guidelines

## Code

 * **Documentation Comments** - You should document your code. New classes 
created in your PRs should have at least a comment explaining the 
responsibility of the class. Documentatio comments on methods would also be
helpful. If your code is undocumented and unreadable, other people can't use it.

 * **Single class files** - Classes should generally be in their own file. An
 exception to this is the store.ts and mutation.ts files which containt many
 interfaces used only as a parameter to a single method.

 * **Code Style** - Besides being readable and logical, your code should also
 follow the TSLint style as well as the style of the existing code where 
 possible. If these conflict, prefer the TSLint style, or the style prescribed
 by WebStorm.

 * **Code Reviews** - Your code should be reviewed before being merged into 
 master. This is a good practice and helps ensure code quality. It will also
 help us stay disciplined about coding style such as documenting our code.
