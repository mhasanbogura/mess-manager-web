.class public abstract La30;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# direct methods
.method public static a(Le72;Landroidx/window/extensions/layout/FoldingFeature;)Lhl0;
    .locals 7

    .line 1
    invoke-virtual {p1}, Landroidx/window/extensions/layout/FoldingFeature;->getType()I

    .line 2
    .line 3
    .line 4
    move-result v0

    .line 5
    const/4 v1, 0x2

    .line 6
    const/4 v2, 0x0

    .line 7
    const/4 v3, 0x1

    .line 8
    if-eq v0, v3, :cond_1

    .line 9
    .line 10
    if-eq v0, v1, :cond_0

    .line 11
    .line 12
    goto :goto_2

    .line 13
    :cond_0
    sget-object v0, Lgl0;->d:Lgl0;

    .line 14
    .line 15
    goto :goto_0

    .line 16
    :cond_1
    sget-object v0, Lgl0;->c:Lgl0;

    .line 17
    .line 18
    :goto_0
    invoke-virtual {p1}, Landroidx/window/extensions/layout/FoldingFeature;->getState()I

    .line 19
    .line 20
    .line 21
    move-result v4

    .line 22
    if-eq v4, v3, :cond_3

    .line 23
    .line 24
    if-eq v4, v1, :cond_2

    .line 25
    .line 26
    goto :goto_2

    .line 27
    :cond_2
    sget-object v1, Lsd0;->d:Lsd0;

    .line 28
    .line 29
    goto :goto_1

    .line 30
    :cond_3
    sget-object v1, Lsd0;->c:Lsd0;

    .line 31
    .line 32
    :goto_1
    invoke-virtual {p1}, Landroidx/window/extensions/layout/FoldingFeature;->getBounds()Landroid/graphics/Rect;

    .line 33
    .line 34
    .line 35
    move-result-object v3

    .line 36
    invoke-virtual {v3}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 37
    .line 38
    .line 39
    iget v4, v3, Landroid/graphics/Rect;->left:I

    .line 40
    .line 41
    iget v5, v3, Landroid/graphics/Rect;->top:I

    .line 42
    .line 43
    iget v6, v3, Landroid/graphics/Rect;->right:I

    .line 44
    .line 45
    iget v3, v3, Landroid/graphics/Rect;->bottom:I

    .line 46
    .line 47
    if-gt v4, v6, :cond_9

    .line 48
    .line 49
    if-gt v5, v3, :cond_8

    .line 50
    .line 51
    iget-object p0, p0, Le72;->a:Loe;

    .line 52
    .line 53
    invoke-virtual {p0}, Loe;->a()Landroid/graphics/Rect;

    .line 54
    .line 55
    .line 56
    move-result-object p0

    .line 57
    sub-int/2addr v3, v5

    .line 58
    if-nez v3, :cond_4

    .line 59
    .line 60
    sub-int v5, v6, v4

    .line 61
    .line 62
    if-nez v5, :cond_4

    .line 63
    .line 64
    goto :goto_2

    .line 65
    :cond_4
    sub-int/2addr v6, v4

    .line 66
    invoke-virtual {p0}, Landroid/graphics/Rect;->width()I

    .line 67
    .line 68
    .line 69
    move-result v4

    .line 70
    if-eq v6, v4, :cond_5

    .line 71
    .line 72
    invoke-virtual {p0}, Landroid/graphics/Rect;->height()I

    .line 73
    .line 74
    .line 75
    move-result v4

    .line 76
    if-eq v3, v4, :cond_5

    .line 77
    .line 78
    goto :goto_2

    .line 79
    :cond_5
    invoke-virtual {p0}, Landroid/graphics/Rect;->width()I

    .line 80
    .line 81
    .line 82
    move-result v4

    .line 83
    if-ge v6, v4, :cond_6

    .line 84
    .line 85
    invoke-virtual {p0}, Landroid/graphics/Rect;->height()I

    .line 86
    .line 87
    .line 88
    move-result v4

    .line 89
    if-ge v3, v4, :cond_6

    .line 90
    .line 91
    goto :goto_2

    .line 92
    :cond_6
    invoke-virtual {p0}, Landroid/graphics/Rect;->width()I

    .line 93
    .line 94
    .line 95
    move-result v4

    .line 96
    if-ne v6, v4, :cond_7

    .line 97
    .line 98
    invoke-virtual {p0}, Landroid/graphics/Rect;->height()I

    .line 99
    .line 100
    .line 101
    move-result p0

    .line 102
    if-ne v3, p0, :cond_7

    .line 103
    .line 104
    :goto_2
    return-object v2

    .line 105
    :cond_7
    new-instance p0, Lhl0;

    .line 106
    .line 107
    new-instance v2, Loe;

    .line 108
    .line 109
    invoke-virtual {p1}, Landroidx/window/extensions/layout/FoldingFeature;->getBounds()Landroid/graphics/Rect;

    .line 110
    .line 111
    .line 112
    move-result-object p1

    .line 113
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 114
    .line 115
    .line 116
    invoke-direct {v2, p1}, Loe;-><init>(Landroid/graphics/Rect;)V

    .line 117
    .line 118
    .line 119
    invoke-direct {p0, v2, v0, v1}, Lhl0;-><init>(Loe;Lgl0;Lsd0;)V

    .line 120
    .line 121
    .line 122
    return-object p0

    .line 123
    :cond_8
    const-string p0, "top must be less than or equal to bottom, top: "

    .line 124
    .line 125
    const-string p1, ", bottom: "

    .line 126
    .line 127
    invoke-static {p0, v5, v3, p1}, Lbo;->i(Ljava/lang/String;IILjava/lang/String;)Ljava/lang/String;

    .line 128
    .line 129
    .line 130
    move-result-object p0

    .line 131
    invoke-static {p0}, Ldw1;->m(Ljava/lang/Object;)V

    .line 132
    .line 133
    .line 134
    return-object v2

    .line 135
    :cond_9
    const-string p0, "Left must be less than or equal to right, left: "

    .line 136
    .line 137
    const-string p1, ", right: "

    .line 138
    .line 139
    invoke-static {p0, v4, v6, p1}, Lbo;->i(Ljava/lang/String;IILjava/lang/String;)Ljava/lang/String;

    .line 140
    .line 141
    .line 142
    move-result-object p0

    .line 143
    invoke-static {p0}, Ldw1;->m(Ljava/lang/Object;)V

    .line 144
    .line 145
    .line 146
    return-object v2
.end method

.method public static b(Le72;Landroidx/window/extensions/layout/WindowLayoutInfo;)Lc72;
    .locals 3

    .line 1
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 2
    .line 3
    .line 4
    invoke-virtual {p1}, Landroidx/window/extensions/layout/WindowLayoutInfo;->getDisplayFeatures()Ljava/util/List;

    .line 5
    .line 6
    .line 7
    move-result-object p1

    .line 8
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 9
    .line 10
    .line 11
    new-instance v0, Ljava/util/ArrayList;

    .line 12
    .line 13
    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 14
    .line 15
    .line 16
    invoke-interface {p1}, Ljava/lang/Iterable;->iterator()Ljava/util/Iterator;

    .line 17
    .line 18
    .line 19
    move-result-object p1

    .line 20
    :cond_0
    :goto_0
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    .line 21
    .line 22
    .line 23
    move-result v1

    .line 24
    if-eqz v1, :cond_2

    .line 25
    .line 26
    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 27
    .line 28
    .line 29
    move-result-object v1

    .line 30
    check-cast v1, Landroidx/window/extensions/layout/DisplayFeature;

    .line 31
    .line 32
    instance-of v2, v1, Landroidx/window/extensions/layout/FoldingFeature;

    .line 33
    .line 34
    if-eqz v2, :cond_1

    .line 35
    .line 36
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 37
    .line 38
    .line 39
    check-cast v1, Landroidx/window/extensions/layout/FoldingFeature;

    .line 40
    .line 41
    invoke-static {p0, v1}, La30;->a(Le72;Landroidx/window/extensions/layout/FoldingFeature;)Lhl0;

    .line 42
    .line 43
    .line 44
    move-result-object v1

    .line 45
    goto :goto_1

    .line 46
    :cond_1
    const/4 v1, 0x0

    .line 47
    :goto_1
    if-eqz v1, :cond_0

    .line 48
    .line 49
    invoke-virtual {v0, v1}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 50
    .line 51
    .line 52
    goto :goto_0

    .line 53
    :cond_2
    new-instance p0, Lc72;

    .line 54
    .line 55
    invoke-direct {p0, v0}, Lc72;-><init>(Ljava/util/List;)V

    .line 56
    .line 57
    .line 58
    return-object p0
.end method

.method public static c(Landroid/content/Context;Landroidx/window/extensions/layout/WindowLayoutInfo;)Lc72;
    .locals 8

    .line 1
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 2
    .line 3
    .line 4
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    .line 5
    .line 6
    const/16 v1, 0x1d

    .line 7
    .line 8
    const/16 v2, 0x1e

    .line 9
    .line 10
    if-lt v0, v2, :cond_d

    .line 11
    .line 12
    sget v3, Lg72;->b:I

    .line 13
    .line 14
    if-lt v0, v2, :cond_0

    .line 15
    .line 16
    invoke-static {p0}, Ltn;->c(Landroid/content/Context;)Le72;

    .line 17
    .line 18
    .line 19
    move-result-object p0

    .line 20
    goto/16 :goto_3

    .line 21
    .line 22
    :cond_0
    move-object v0, p0

    .line 23
    :goto_0
    instance-of v3, v0, Landroid/content/ContextWrapper;

    .line 24
    .line 25
    const/4 v4, 0x0

    .line 26
    const-string v5, " is not a UiContext"

    .line 27
    .line 28
    if-eqz v3, :cond_c

    .line 29
    .line 30
    instance-of v3, v0, Landroid/app/Activity;

    .line 31
    .line 32
    if-eqz v3, :cond_1

    .line 33
    .line 34
    goto :goto_1

    .line 35
    :cond_1
    instance-of v6, v0, Landroid/inputmethodservice/InputMethodService;

    .line 36
    .line 37
    if-eqz v6, :cond_2

    .line 38
    .line 39
    goto :goto_1

    .line 40
    :cond_2
    move-object v6, v0

    .line 41
    check-cast v6, Landroid/content/ContextWrapper;

    .line 42
    .line 43
    invoke-virtual {v6}, Landroid/content/ContextWrapper;->getBaseContext()Landroid/content/Context;

    .line 44
    .line 45
    .line 46
    move-result-object v7

    .line 47
    if-nez v7, :cond_b

    .line 48
    .line 49
    :goto_1
    if-eqz v3, :cond_3

    .line 50
    .line 51
    check-cast p0, Landroid/app/Activity;

    .line 52
    .line 53
    invoke-static {p0}, Lg72;->a(Landroid/app/Activity;)Le72;

    .line 54
    .line 55
    .line 56
    move-result-object p0

    .line 57
    goto/16 :goto_3

    .line 58
    .line 59
    :cond_3
    instance-of v0, v0, Landroid/inputmethodservice/InputMethodService;

    .line 60
    .line 61
    if-eqz v0, :cond_a

    .line 62
    .line 63
    const-string v0, "window"

    .line 64
    .line 65
    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    .line 66
    .line 67
    .line 68
    move-result-object p0

    .line 69
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 70
    .line 71
    .line 72
    check-cast p0, Landroid/view/WindowManager;

    .line 73
    .line 74
    invoke-interface {p0}, Landroid/view/WindowManager;->getDefaultDisplay()Landroid/view/Display;

    .line 75
    .line 76
    .line 77
    move-result-object p0

    .line 78
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 79
    .line 80
    .line 81
    new-instance v0, Landroid/graphics/Point;

    .line 82
    .line 83
    invoke-direct {v0}, Landroid/graphics/Point;-><init>()V

    .line 84
    .line 85
    .line 86
    invoke-virtual {p0, v0}, Landroid/view/Display;->getRealSize(Landroid/graphics/Point;)V

    .line 87
    .line 88
    .line 89
    new-instance p0, Landroid/graphics/Rect;

    .line 90
    .line 91
    iget v3, v0, Landroid/graphics/Point;->x:I

    .line 92
    .line 93
    iget v0, v0, Landroid/graphics/Point;->y:I

    .line 94
    .line 95
    const/4 v4, 0x0

    .line 96
    invoke-direct {p0, v4, v4, v3, v0}, Landroid/graphics/Rect;-><init>(IIII)V

    .line 97
    .line 98
    .line 99
    new-instance v0, Le72;

    .line 100
    .line 101
    sget v3, Landroid/os/Build$VERSION;->SDK_INT:I

    .line 102
    .line 103
    const/16 v4, 0x24

    .line 104
    .line 105
    if-lt v3, v4, :cond_4

    .line 106
    .line 107
    new-instance v1, Li62;

    .line 108
    .line 109
    invoke-direct {v1}, Li62;-><init>()V

    .line 110
    .line 111
    .line 112
    goto :goto_2

    .line 113
    :cond_4
    const/16 v4, 0x23

    .line 114
    .line 115
    if-lt v3, v4, :cond_5

    .line 116
    .line 117
    new-instance v1, Lh62;

    .line 118
    .line 119
    invoke-direct {v1}, Lh62;-><init>()V

    .line 120
    .line 121
    .line 122
    goto :goto_2

    .line 123
    :cond_5
    const/16 v4, 0x22

    .line 124
    .line 125
    if-lt v3, v4, :cond_6

    .line 126
    .line 127
    new-instance v1, Lg62;

    .line 128
    .line 129
    invoke-direct {v1}, Lg62;-><init>()V

    .line 130
    .line 131
    .line 132
    goto :goto_2

    .line 133
    :cond_6
    const/16 v4, 0x1f

    .line 134
    .line 135
    if-lt v3, v4, :cond_7

    .line 136
    .line 137
    new-instance v1, Lf62;

    .line 138
    .line 139
    invoke-direct {v1}, Lf62;-><init>()V

    .line 140
    .line 141
    .line 142
    goto :goto_2

    .line 143
    :cond_7
    if-lt v3, v2, :cond_8

    .line 144
    .line 145
    new-instance v1, Le62;

    .line 146
    .line 147
    invoke-direct {v1}, Le62;-><init>()V

    .line 148
    .line 149
    .line 150
    goto :goto_2

    .line 151
    :cond_8
    if-lt v3, v1, :cond_9

    .line 152
    .line 153
    new-instance v1, Ld62;

    .line 154
    .line 155
    invoke-direct {v1}, Ld62;-><init>()V

    .line 156
    .line 157
    .line 158
    goto :goto_2

    .line 159
    :cond_9
    new-instance v1, Lc62;

    .line 160
    .line 161
    invoke-direct {v1}, Lc62;-><init>()V

    .line 162
    .line 163
    .line 164
    :goto_2
    invoke-virtual {v1}, Lj62;->b()Lv62;

    .line 165
    .line 166
    .line 167
    move-result-object v1

    .line 168
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 169
    .line 170
    .line 171
    new-instance v2, Loe;

    .line 172
    .line 173
    invoke-direct {v2, p0}, Loe;-><init>(Landroid/graphics/Rect;)V

    .line 174
    .line 175
    .line 176
    invoke-direct {v0, v2, v1}, Le72;-><init>(Loe;Lv62;)V

    .line 177
    .line 178
    .line 179
    move-object p0, v0

    .line 180
    :goto_3
    invoke-static {p0, p1}, La30;->b(Le72;Landroidx/window/extensions/layout/WindowLayoutInfo;)Lc72;

    .line 181
    .line 182
    .line 183
    move-result-object p0

    .line 184
    return-object p0

    .line 185
    :cond_a
    invoke-static {p0, v5}, Lp50;->n(Ljava/lang/Object;Ljava/lang/Object;)V

    .line 186
    .line 187
    .line 188
    return-object v4

    .line 189
    :cond_b
    invoke-virtual {v6}, Landroid/content/ContextWrapper;->getBaseContext()Landroid/content/Context;

    .line 190
    .line 191
    .line 192
    move-result-object v0

    .line 193
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 194
    .line 195
    .line 196
    goto/16 :goto_0

    .line 197
    .line 198
    :cond_c
    const-string p1, "Context "

    .line 199
    .line 200
    invoke-static {p0, v5, p1}, Lm81;->p(Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/String;)V

    .line 201
    .line 202
    .line 203
    return-object v4

    .line 204
    :cond_d
    if-lt v0, v1, :cond_e

    .line 205
    .line 206
    instance-of v0, p0, Landroid/app/Activity;

    .line 207
    .line 208
    if-eqz v0, :cond_e

    .line 209
    .line 210
    sget v0, Lg72;->b:I

    .line 211
    .line 212
    check-cast p0, Landroid/app/Activity;

    .line 213
    .line 214
    invoke-static {p0}, Lg72;->a(Landroid/app/Activity;)Le72;

    .line 215
    .line 216
    .line 217
    move-result-object p0

    .line 218
    invoke-static {p0, p1}, La30;->b(Le72;Landroidx/window/extensions/layout/WindowLayoutInfo;)Lc72;

    .line 219
    .line 220
    .line 221
    move-result-object p0

    .line 222
    return-object p0

    .line 223
    :cond_e
    new-instance p0, Ljava/lang/UnsupportedOperationException;

    .line 224
    .line 225
    const-string p1, "Display Features are only supported after Q. Display features for non-Activity contexts are not expected to be reported on devices running Q."

    .line 226
    .line 227
    invoke-direct {p0, p1}, Ljava/lang/UnsupportedOperationException;-><init>(Ljava/lang/String;)V

    .line 228
    .line 229
    .line 230
    throw p0
.end method
