.class public final enum La11;
.super Ljava/lang/Enum;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# static fields
.field public static final b:Luv;

.field public static final synthetic c:[La11;


# instance fields
.field public final a:I


# direct methods
.method static constructor <clinit>()V
    .locals 5

    .line 1
    new-instance v0, La11;

    .line 2
    .line 3
    const-string v1, "ALWAYS_ALLOW"

    .line 4
    .line 5
    const/4 v2, 0x0

    .line 6
    invoke-direct {v0, v1, v2, v2}, La11;-><init>(Ljava/lang/String;II)V

    .line 7
    .line 8
    .line 9
    new-instance v1, La11;

    .line 10
    .line 11
    const-string v2, "COMPATIBILITY_MODE"

    .line 12
    .line 13
    const/4 v3, 0x1

    .line 14
    invoke-direct {v1, v2, v3, v3}, La11;-><init>(Ljava/lang/String;II)V

    .line 15
    .line 16
    .line 17
    new-instance v2, La11;

    .line 18
    .line 19
    const-string v3, "NEVER_ALLOW"

    .line 20
    .line 21
    const/4 v4, 0x2

    .line 22
    invoke-direct {v2, v3, v4, v4}, La11;-><init>(Ljava/lang/String;II)V

    .line 23
    .line 24
    .line 25
    filled-new-array {v0, v1, v2}, [La11;

    .line 26
    .line 27
    .line 28
    move-result-object v0

    .line 29
    sput-object v0, La11;->c:[La11;

    .line 30
    .line 31
    new-instance v0, Luv;

    .line 32
    .line 33
    const/16 v1, 0x13

    .line 34
    .line 35
    invoke-direct {v0, v1}, Luv;-><init>(I)V

    .line 36
    .line 37
    .line 38
    sput-object v0, La11;->b:Luv;

    .line 39
    .line 40
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;II)V
    .locals 0

    .line 1
    invoke-direct {p0, p1, p2}, Ljava/lang/Enum;-><init>(Ljava/lang/String;I)V

    .line 2
    .line 3
    .line 4
    iput p3, p0, La11;->a:I

    .line 5
    .line 6
    return-void
.end method

.method public static valueOf(Ljava/lang/String;)La11;
    .locals 1

    .line 1
    const-class v0, La11;

    .line 2
    .line 3
    invoke-static {v0, p0}, Ljava/lang/Enum;->valueOf(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;

    .line 4
    .line 5
    .line 6
    move-result-object p0

    .line 7
    check-cast p0, La11;

    .line 8
    .line 9
    return-object p0
.end method

.method public static values()[La11;
    .locals 1

    .line 1
    sget-object v0, La11;->c:[La11;

    .line 2
    .line 3
    invoke-virtual {v0}, Ljava/lang/Object;->clone()Ljava/lang/Object;

    .line 4
    .line 5
    .line 6
    move-result-object v0

    .line 7
    check-cast v0, [La11;

    .line 8
    .line 9
    return-object v0
.end method
