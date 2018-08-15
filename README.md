## Jutility

> A simple command line utility tool I have written for myself which can generate random secure passwords and passphrases, as well as AES encrypt files or directories. The name comes from my first name Jakob.

For random number generations it uses the [random-number-csprng](https://github.com/joepie91/node-random-number-csprng#readme) library to generate cryptographically secure pseudo-random numbers. 

### Install

```
npm install -g jutility
```

### Usage

#### Password Generation

```
jutility password [length] [noNumbers] [noSymbols] [noUpper] [noSimilar]
```
* `length` [required] definies the length of the password
* `noNumbers` [optional] password will not contain any numbers
* `noSymbols` [optional] password will not contain any symbols
* `noUpper` [optional] password will not contain any uppercase letters
* `noSimiliar` [optional] password will not contain any similiar letters like ilI ec.

#### Passphrase Generation

```
jutility passphrase [length]
```
* `length` [required] of how much words the Passphrase should consist of

At the moment the Passphrase Generator uses a german dictionary consisting of about 5 million words.
You could easily change the used dictionary by changing the file in `res/german.dic` or add your own file.
The current code requires each word in a file to be seperated by newline.

#### AES Encryption

```
jutility [encrypt|decrypt] [file] [key] [iv]
```
* `encrypt|decrypt` if you want to encrypt of decrypt files
* `file` the name of the file or directory you want to encrypt or decrypt. In your cmd you have to navigate directly
to the file or directory. Paths to a file or directory are not supported.
* `key` The Key you want to use, has to be a 32 character long string.
* `iv` Will be used for the initialization vector, has to be 16 character long string.


The library is capable of handling recursive directories. But please be to test if everything works correctly for your, before
you use it on a everyday basis. I have only tested in on one OS.


