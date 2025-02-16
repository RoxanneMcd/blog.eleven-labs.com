---
layout: post
lang: en
date: '2016-09-08'
categories:
  - php
authors:
  - aandre
excerpt: >-
  Some time ago, well almost one year ago (time just flies!), I wrote about PHP
  7.0\. Ten months later, things are moving again: PHP 7.1 is in RC1 stage.
title: PHP 7.1 - For dummies candidates
slug: php-7-1-dummies-candidates
oldCategoriesAndTags:
  - php
  - non classé
permalink: /en/php-7-1-dummies-candidates/
---
Some time ago, well almost one year ago (time just flies!), I wrote about PHP 7.0\. Ten months later, things are moving again: PHP 7.1 is in RC1 stage.

This article doesn't pretend to be a list of all the modifications, but points out the new interesting features (you'll find at the bottom a link to all PHP 7.1 RFC's which have been used to write this article). Moreover, you need to know and understand all features introduced in PHP 7.0.

# RC1?

RC means "Release Candidate". In the development process we often have alphas, betas, and release candidates. Those are major versions in development process. And for every major versions, there are also minor versions, just as in the normal process. Consequently, RC1 is a minor version. If bugs are spotted (generally minor ones), a RC2 will be... well... released.

As far as we know, PHP 7.1 should be released anytime soon, at least before the end of the year!

# Features

## Nullable types

In my opinion, it's the most interesting feature of PHP 7.1\. As you might know (I hope so!), PHP 7.0 allowed to type hint scalar in parameters of functions, but also type hint returns (both classes and scalars). However, there was something missing: the ability to pass or return null when using type hinting.

Since an image (ok it's a video) is worth a thousand words, you can see above the behavior of PHP 7.0 when giving null to type hinted methods or functions (it's also the case with PHP5):

[![](https://asciinema.org/a/84925.png)](https://asciinema.org/a/84925){:rel="nofollow"}

Now, let's see a simple workaround for parameters, which is not solving the problem when it's about type hinted returns:

[![](https://asciinema.org/a/84927.png)](https://asciinema.org/a/84927){:rel="nofollow"}

And now, we will adapt our code, to make it work with PHP 7.1, and completely solve our problem:

[![](https://asciinema.org/a/84926.png)](https://asciinema.org/a/84926){:rel="nofollow"}

As you can see, we can now, without using default parameters (such as = null), give or return null values thanks to our type prefixed with the operator "?".

## Multi-Catch

It has long been possible to do multi-catching with the use of multiple catch blocks, one by one. Yet, it can be redundant, especially when we want to handle the same way two exceptions which have nothing in common. Here is how you should use it:

[![](https://asciinema.org/a/84954.png)](https://asciinema.org/a/84954){:rel="nofollow"}

As you can see, I only used two exceptions, but I could have used much more if needed.

## Void type

Another new type has been introduced, the void type. Here is its behavior:

[![](https://asciinema.org/a/84952.png)](https://asciinema.org/a/84952){:rel="nofollow"}

As shown in this video, it's okay to use a return with nothing behind, but it's strictly forbidden to return null. From this previous test, I asked myself a weird and useless question: is it possible to prefix our void type with our nullable operator? The video proves that it luckily can't be.

At first sight, the use of void may seem useless (mainly in this precise exemple) but it is not. Used in an interface, it ensures that implementations deflect too much from the original purpose of the interface.

## Iterable type

Following the same pattern of void, an iterable type has also been introduced. Again, its use might not be obvious at first sight because we have the native Traversable interface. Since we move forward type hinting (and embrace it right ? RIGHT ?!), we had no solution to represent both scalar arrays and traversable objects. It was inconsistent since then, because we could pass arrays or traversable objects the same way before type hinting.

It's usable in type hinting of parameters and returns.

## Class constant visibility

Something I found missing the whole time, and which is now solved. Class constant visibility allows us to set a visibility to class constants (yeah I know, it's in the name, deal with it!). From now on, you'll avoid static to restrict visibility of things you should have called constants.

You might want to know that if you don't indicate visibility, it will be public by default, to be compliant with older versions of PHP behaviors.

##  Miscellaneous

We can also add randomly in the list of interesting features the following:

*   the short syntax for list($foo, $bar, $baz) => [$foo, $bar, $baz], which goes in the continuity of improvements done in PHP 5.4 for arrays;
*   support of keys in list, for key-values arrays;
*   a better way to handle octal representation;
*   a very restrictive use of $this in class to avoid side effects due to random-weird reassignements;
*   etc.

# Okay, how can I test those wonderful things?

You first want to know that you shouldn't use it in production environments! It's a RC for duck's sake! And to answer:

*   compile it from source, this [guide](http://php.net/manual/fr/install.windows.building.php){:rel="nofollow"} explains it very clearly;
*   use phpenv, which is basically compiling it from source in an automated way.

I recommend using the second solution on dev environments since it's not rare professionnally to handle projects not using same PHP versions. PHPEnv allows you to run multiple versions of PHP in CLI, based on the project. I'll certainly do a post to explain how to plug Nginx, PHP-FPM and PHPEnv to have multiple versions of PHP in a HTTP way (on dev env, right ? RIGHT ?!).

# Conclusion

This version, even being minor, comes with a lot of changes.

I'm aware that PHP is not the perfect language, and has many missing features. But we can hope that, one day, we will have native annotations or enumerations for example. The community is constantly moving, and tries really hard to improve PHP and its reputation.

If you want to know more about PHP 7.1 features, I invite you to read [RFC's](https://wiki.php.net/rfc#php_71){:rel="nofollow"}.

See you later for an article on PHP 7.2, if features are good enough to be listed ;)

![cat bye goodbye done im out](https://media.giphy.com/media/iPiUxztIL4Sl2/giphy.gif){:rel="nofollow"}
